"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import { Camera, MapPin, Loader2, PartyPopper, Upload } from "lucide-react";
import { collection, addDoc, serverTimestamp, GeoPoint } from "firebase/firestore"; 
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/auth-context";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyzeImageSeverity } from "@/ai/flows/analyze-image-severity";
import { determineIssuePriority } from "@/ai/flows/determine-issue-priority";
import type { Ticket } from "@/types";

const issueCategories = [
  "Pothole",
  "Graffiti",
  "Waste Management",
  "Broken Streetlight",
  "Safety Hazard",
  "Tree Maintenance",
  "Other",
];

const formSchema = z.object({
  category: z.string({ required_error: "Please select a category." }),
  notes: z.string().min(10, {
    message: "Notes must be at least 10 characters.",
  }),
});

interface ReportIssueFormProps {
    onIssueSubmitted: (ticket: Omit<Ticket, 'id' | 'submittedDate' | 'estimatedResolutionDate'>) => void;
}

export default function ReportIssueForm({ onIssueSubmitted }: ReportIssueFormProps) {
  const { user } = useAuth();
  const [photoDataUri, setPhotoDataUri] = React.useState<string | null>(null);
  const [location, setLocation] = React.useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = React.useState("Fetching location...");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);
  const [newTicketId, setNewTicketId] = React.useState("");
  const { toast } = useToast();
  
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
  });

  React.useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof navigator.mediaDevices?.getUserMedia !== 'function') {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();
  }, []);
  
  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setAddress(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
        },
        () => {
          setAddress("Unable to retrieve location. Please grant permission.");
          toast({ variant: 'destructive', title: 'Location Error', description: 'Could not retrieve location.' });
        }
      );
    } else {
      setAddress("Geolocation is not supported by your browser.");
    }
  }, [toast]);
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setPhotoDataUri(dataUri);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoDataUri(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!location || !user) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "User and location are required to submit an issue.",
      });
      return;
    }
    
    if (!photoDataUri) {
      toast({
        variant: 'destructive',
        title: 'Photo Required',
        description: 'Please capture or upload a photo of the issue.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { severityScore, reasoning } = await analyzeImageSeverity({ photoDataUri });
      const { priorityLevel } = await determineIssuePriority({
        imageAnalysisScore: severityScore,
        category: values.category,
        notes: values.notes,
      });

      const ticketData = {
        userId: user.uid,
        category: values.category,
        notes: values.notes,
        location: new GeoPoint(location.lat, location.lng),
        address: address,
        status: 'Submitted' as const,
        priority: priorityLevel,
        submittedDate: serverTimestamp(),
        estimatedResolutionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Placeholder: 2 weeks
        severityScore: severityScore,
        severityReasoning: reasoning,
      };

      const docRef = await addDoc(collection(db, "tickets"), ticketData);

      onIssueSubmitted(ticketData);
      setNewTicketId(docRef.id);
      setShowSuccessDialog(true);
      form.reset();
      setPhotoDataUri(null);

    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error saving your report. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
           <FormItem>
              <FormLabel>Photo</FormLabel>
              <Tabs defaultValue="capture" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="capture">Capture</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="capture">
                   <div className="relative aspect-video w-full bg-muted rounded-md overflow-hidden border">
                      <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                       <canvas ref={canvasRef} className="hidden" />
                       {photoDataUri && <Image src={photoDataUri} alt="Preview" fill style={{ objectFit: 'cover' }} className="z-10" />}
                    </div>
                     {!hasCameraPermission && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                          Please allow camera access in your browser settings to use this feature.
                        </AlertDescription>
                      </Alert>
                    )}
                    <div className="flex justify-center mt-2">
                        <Button type="button" onClick={handleCapture} disabled={!hasCameraPermission || isLoading}>
                            <Camera className="mr-2" />
                            Capture Photo
                        </Button>
                    </div>
                </TabsContent>
                <TabsContent value="upload">
                  <div className="relative aspect-video w-full bg-muted rounded-md overflow-hidden border flex items-center justify-center">
                    <Input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                    {photoDataUri ? (
                        <Image src={photoDataUri} alt="Uploaded Preview" fill style={{ objectFit: 'cover' }} />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Upload className="mx-auto h-12 w-12" />
                        <p>Click the button to upload an image</p>
                      </div>
                    )}
                  </div>
                   <div className="flex justify-center mt-2">
                      <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                          <Upload className="mr-2" />
                          {photoDataUri ? 'Change Photo' : 'Select Photo'}
                      </Button>
                  </div>
                </TabsContent>
              </Tabs>
               <FormDescription>
                  Provide a photo for AI analysis. The photo itself will not be stored.
                </FormDescription>
           </FormItem>

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an issue category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {issueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the issue in detail..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide as much detail as possible to help us address the issue quickly.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormItem>
            <FormLabel>Location</FormLabel>
            <div className="flex items-center space-x-2 rounded-md border px-3 py-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{address}</span>
            </div>
            <FormDescription>
              Location is automatically captured using your device's GPS.
            </FormDescription>
          </FormItem>

          <Button type="submit" disabled={isLoading || !photoDataUri} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing & Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </Button>
        </form>
      </Form>

      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
               <PartyPopper className="h-6 w-6 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center">Submission Successful!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Thank you for your report! Your ticket ID is <span className="font-bold text-primary">{newTicketId}</span>. You can track its status in the "My Tickets" tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)} className="w-full">
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
