
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Camera, RefreshCw, X, Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CameraModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhotoCapture: (dataUri: string) => void;
}

export default function CameraModal({ open, onOpenChange, onPhotoCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (open && !capturedImage) {
      const startStream = async () => {
        try {
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode }
          });
          setStream(newStream);
          if (videoRef.current) {
            videoRef.current.srcObject = newStream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          toast({
            variant: 'destructive',
            title: "Camera Error",
            description: "Could not access the camera. Please check permissions.",
          });
          onOpenChange(false);
        }
      };
      startStream();
    } else {
      stopStream();
    }

    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, facingMode, capturedImage]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUri);
        stopStream();
      }
    }
  };

  const handleFlipCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onPhotoCapture(capturedImage);
      handleClose();
    }
  };

  const handleClose = () => {
    stopStream();
    setCapturedImage(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-fullscreen p-0 gap-0 border-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Camera</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-screen bg-black flex items-center justify-center">
            
          <div className="absolute top-4 left-4 z-20">
              <Button variant="ghost" size="icon" onClick={handleClose} className="rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white">
                  <ArrowLeft />
              </Button>
          </div>

          {!capturedImage ? (
            <>
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-around items-center z-10">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
                    onClick={handleFlipCamera}
                >
                  <RefreshCw />
                </Button>
                <Button 
                    size="icon"
                    className="w-20 h-20 rounded-full border-4 border-white bg-white/20 hover:bg-white/30 flex items-center justify-center" 
                    onClick={handleCapture}
                >
                  <Camera className="w-10 h-10 text-white" />
                </Button>
                 <div className="w-10 h-10" />
              </div>
            </>
          ) : (
            <>
              <canvas ref={canvasRef} className="hidden" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent flex justify-around items-center z-10">
                 <Button 
                    variant="ghost"
                    size="icon"
                    className="w-16 h-16 rounded-full bg-destructive/80 text-white hover:bg-destructive"
                    onClick={handleRetake}
                 >
                    <X className="w-8 h-8"/>
                 </Button>
                 <Button 
                    variant="ghost"
                    size="icon"
                    className="w-16 h-16 rounded-full bg-green-600/80 text-white hover:bg-green-600"
                    onClick={handleConfirm}
                 >
                    <Check className="w-8 h-8"/>
                 </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
