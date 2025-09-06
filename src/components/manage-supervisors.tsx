"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import type { Supervisor } from "@/types";

const formSchema = z.object({
  userId: z.string().min(3, "User ID must be at least 3 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  department: z.string({ required_error: "Please select a department."}),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits."),
});

const departments = [
    "Public Works",
    "Sanitation",
    "Parks and Recreation",
    "Code Enforcement",
    "Water Department",
    "Other"
];

interface ManageSupervisorsProps {
  municipalId: string;
  supervisors: Supervisor[];
}

export default function ManageSupervisors({ municipalId, supervisors }: ManageSupervisorsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: "",
      password: "",
      department: "",
      phoneNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!municipalId) {
        toast({ variant: "destructive", title: "Error", description: "Municipal ID not found." });
        return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, `municipality/${municipalId}/supervisors`), {
        ...values,
        municipalId,
      });
      await addDoc(collection(db, 'supervisors'), {
        ...values,
        municipalId,
      });
      toast({
        title: "Supervisor Created",
        description: "The new supervisor account has been created successfully.",
      });
      form.reset();
    } catch (error) {
      console.error("Error creating supervisor: ", error);
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: "There was an error creating the supervisor.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Supervisors</CardTitle>
        <CardDescription>Create and view supervisor accounts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-8">
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input placeholder="supervisor.one" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="123-456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Supervisor
            </Button>
          </form>
        </Form>
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Phone</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {supervisors.length > 0 ? (
                        supervisors.map(s => (
                            <TableRow key={s.id}>
                                <TableCell className="font-medium">{s.userId}</TableCell>
                                <TableCell>{s.department}</TableCell>
                                <TableCell>{s.phoneNumber}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">No supervisors created yet.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}
