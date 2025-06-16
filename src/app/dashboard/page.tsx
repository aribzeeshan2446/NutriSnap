
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { handleEstimateCaloriesAction } from '@/app/(actions)/calorie-actions';
import type { EstimateCalorieContentOutput } from '@/ai/flows/estimate-calorie-content';
import { useToast } from '@/hooks/use-toast';
import { useCalorieLog } from '@/hooks/use-calorie-log';
import { Progress } from '@/components/ui/progress';
import { useUserSettings } from '@/hooks/use-user-settings';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';


async function dataURItoFile(dataURI: string, filename: string): Promise<File> {
  const res = await fetch(dataURI);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
}

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoadingEstimation, setIsLoadingEstimation] = useState(false);
  const [estimationResult, setEstimationResult] = useState<EstimateCalorieContentOutput | null>(null);
  const { toast } = useToast();
  const { addLogEntry, logEntries } = useCalorieLog();
  const { settings } = useUserSettings();
  
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);


  useEffect(() => {
    let currentStream: MediaStream | null = null;
    const videoElement = videoRef.current;

    const startSelectedStream = async () => {
      if (isCameraOpen && hasCameraPermission === true && videoElement && selectedDeviceId) {
        if (videoElement.srcObject) {
            const existingStream = videoElement.srcObject as MediaStream;
            existingStream.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
        }
        try {
          currentStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: selectedDeviceId } }
          });
          videoElement.srcObject = currentStream;
          await videoElement.play().catch(playError => {
            console.error("Error attempting to play video:", playError);
            toast({
              variant: 'destructive',
              title: 'Camera Playback Failed',
              description: 'Could not play the camera stream.',
            });
          });
        } catch (err: any) {
          console.error(`Error starting stream for device ${selectedDeviceId}:`, err);
          toast({
            variant: 'destructive',
            title: 'Camera Stream Failed',
            description: err.message || `Could not start camera: ${selectedDeviceId}.`,
          });
           setHasCameraPermission(false); 
        }
      }
    };

    startSelectedStream();

    return () => { 
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
      if (videoElement && videoElement.srcObject === currentStream) { 
        videoElement.srcObject = null;
      }
    };
  }, [isCameraOpen, hasCameraPermission, selectedDeviceId, toast]); 

  useEffect(() => {
    const videoElement = videoRef.current; 
    return () => {
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null; 
      }
    };
  }, []);

  const handleCloseCamera = useCallback(() => {
    setIsCameraOpen(false); 
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isCameraOpen) handleCloseCamera();
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setEstimationResult(null); 
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleOpenCamera = async () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setEstimationResult(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({ title: 'Camera API not supported', description: 'Your browser does not support camera access.', variant: 'destructive' });
      setHasCameraPermission(false); 
      setIsCameraOpen(true); 
      return;
    }
    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true }); 
      setHasCameraPermission(true); 
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableCameras(videoDevices);

      if (videoDevices.length > 0) {
        const backCamera = videoDevices.find(device => device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('environment'));
        const defaultCameraId = backCamera ? backCamera.deviceId : videoDevices[0].deviceId;
        
        if (!selectedDeviceId || !videoDevices.find(d => d.deviceId === selectedDeviceId)) {
             setSelectedDeviceId(defaultCameraId);
        }
        setIsCameraOpen(true); 
      } else {
        toast({ title: 'No Cameras Found', description: 'Could not find any video input devices.', variant: 'destructive'});
        setHasCameraPermission(false); 
        setIsCameraOpen(true); 
      }
      tempStream.getTracks().forEach(track => track.stop());
    } catch (error: any) {
      console.error('Error accessing camera:', error);
      setHasCameraPermission(false);
      setIsCameraOpen(true); 
      toast({
        variant: 'destructive',
        title: 'Camera Access Denied',
        description: error.message || 'Please enable camera permissions.',
      });
    }
  };
  
  const handleSwitchCamera = () => {
    if (availableCameras.length > 1 && selectedDeviceId) {
      const currentIndex = availableCameras.findIndex(device => device.deviceId === selectedDeviceId);
      const nextIndex = (currentIndex + 1) % availableCameras.length;
      setSelectedDeviceId(availableCameras[nextIndex].deviceId);
    } else if (availableCameras.length > 0 && !selectedDeviceId) {
      setSelectedDeviceId(availableCameras[0].deviceId);
    }
  };

  const handleCapturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!video.videoWidth || !video.videoHeight || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        toast({ title: "Camera Not Ready", description: "Camera stream not ready.", variant: "destructive" });
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg'); 
        setPreviewUrl(dataUri);
        const capturedFile = await dataURItoFile(dataUri, `capture-${Date.now()}.jpg`);
        setSelectedFile(capturedFile);
        handleCloseCamera(); 
        setEstimationResult(null); 
      } else {
         toast({ title: "Canvas Error", description: "Could not get canvas context.", variant: "destructive" });
      }
    } else {
       toast({ title: "Capture Error", description: "Camera or canvas not ready.", variant: "destructive" });
    }
  };

  const handleSubmitEstimation = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!selectedFile) {
      toast({ title: 'No image provided', description: 'Please select an image or capture one.', variant: 'destructive' });
      return;
    }

    setIsLoadingEstimation(true);
    const formData = new FormData();
    if (selectedFile) formData.append('imageFile', selectedFile);
    formData.append('previousEstimates', ""); 

    const result = await handleEstimateCaloriesAction(formData);
    setIsLoadingEstimation(false);

    if (result.error) {
      toast({ title: 'Estimation Error', description: result.error, variant: 'destructive' });
    } else if (result.data) {
      setEstimationResult(result.data);
      const foodDesc = selectedFile ? `Meal from image (${selectedFile.name})` : 'Meal';
      toast({ title: 'Estimation Successful', description: `Estimated ${result.data.calorieEstimate} calories.` });
      addLogEntry({
        foodDescription: foodDesc,
        calories: result.data.calorieEstimate,
        protein: result.data.macroContent.protein,
        carbohydrates: result.data.macroContent.carbohydrates,
        fat: result.data.macroContent.fat,
        imageUrl: previewUrl || undefined, 
        estimatedBy: 'ai',
      });
    }
  };

  const resetEstimationState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setEstimationResult(null);
    if (isCameraOpen) handleCloseCamera(); 
  }

  const today = new Date().toISOString().split('T')[0];
  const todaysCalories = hasMounted ? logEntries
    .filter(entry => entry.date.startsWith(today))
    .reduce((sum, entry) => sum + entry.calories, 0) : 0;

  const dailyGoal = hasMounted ? (settings.dailyCalorieGoal || 2000) : 2000;
  const progressPercentage = hasMounted && dailyGoal > 0 ? Math.min((todaysCalories / dailyGoal) * 100, 100) : 0;
  const recentLogs = hasMounted ? logEntries.slice(0, 3) : []; 

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-0 mt-0">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="lg:col-span-2 space-y-6 mt-0">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Icons.Camera className="h-8 w-8 text-primary" />
              {estimationResult ? 'Nutrition Estimate' : 'Estimate Meal Calories'}
            </CardTitle>
            <CardDescription>
              {estimationResult ? "Here's the nutritional breakdown of your meal." : 
               isCameraOpen ? "Position your meal clearly and capture a photo." :
               "Upload an image or use your camera to estimate calories."}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmitEstimation}>
            <CardContent className="space-y-4">
              {isLoadingEstimation ? (
                <div className="flex flex-col items-center justify-center h-60 text-center p-6">
                  <Icons.Loader2 className="h-20 w-20 text-primary animate-spin mx-auto mb-6" />
                  <p className="text-lg font-semibold text-primary">Analyzing Your Meal...</p>
                  <p className="text-muted-foreground">This might take a few moments.</p>
                </div>
              ) : estimationResult ? (
                <div className="space-y-6">
                  {previewUrl && (
                    <div className="p-2 border-2 border-dashed border-primary/50 rounded-lg aspect-video relative overflow-hidden bg-muted/30">
                      <Image src={previewUrl} alt="Food preview" layout="fill" objectFit="contain" data-ai-hint="food meal" />
                    </div>
                  )}
                  <div className="text-5xl font-bold text-center text-primary">
                    {estimationResult.calorieEstimate.toLocaleString()}
                    <span className="text-xl font-normal text-muted-foreground"> kcal</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-muted/50 rounded-md border">
                        <span className="block font-semibold text-lg">{estimationResult.macroContent.protein.toLocaleString()} g</span>
                        <span className="text-xs text-muted-foreground">Protein</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-md border">
                        <span className="block font-semibold text-lg">{estimationResult.macroContent.carbohydrates.toLocaleString()} g</span>
                        <span className="text-xs text-muted-foreground">Carbohydrates</span>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-md border">
                        <span className="block font-semibold text-lg">{estimationResult.macroContent.fat.toLocaleString()} g</span>
                        <span className="text-xs text-muted-foreground">Fat</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1.5 mt-2">Detected Ingredients:</h4>
                    <ScrollArea className="text-sm text-muted-foreground border rounded-md p-3 h-24 bg-muted/30">
                      {estimationResult.ingredients}
                    </ScrollArea>
                  </div>
                </div>
              ) : isCameraOpen ? (
                <div className="space-y-4">
                  <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted border" autoPlay playsInline muted />
                  {hasCameraPermission === false && ( 
                     <Alert variant="destructive">
                        <Icons.Camera className="h-4 w-4" />
                        <AlertTitle>Camera Access Denied or Unavailable</AlertTitle>
                        <AlertDescription>Please enable camera permissions and ensure your camera is not in use by another application.</AlertDescription>
                      </Alert>
                  )}
                   {isCameraOpen && hasCameraPermission === true && (
                     <div className="flex flex-col sm:flex-row gap-2">
                        <Button type="button" onClick={handleCapturePhoto} className="flex-1">
                          <Icons.Camera className="mr-2 h-5 w-5" /> Capture Photo
                        </Button>
                        {availableCameras.length > 1 && (
                           <Button type="button" onClick={handleSwitchCamera} variant="outline" className="flex-1 sm:flex-none">
                             <Icons.SwitchCamera className="mr-2 h-5 w-5" /> Switch
                           </Button>
                        )}
                        <Button type="button" onClick={handleCloseCamera} variant="outline" className="flex-1 sm:flex-none">
                          Close Camera
                        </Button>
                    </div>
                   )}
                </div>
              ) : previewUrl ? (
                <div className="p-2 border-2 border-dashed border-primary/50 rounded-lg aspect-video relative overflow-hidden bg-muted/30">
                  <Image src={previewUrl} alt="Food preview" layout="fill" objectFit="contain" data-ai-hint="food meal"/>
                </div>
              ) : (
                <div className="text-center p-8 border border-muted-foreground/20 rounded-lg aspect-video bg-muted/20 flex flex-col justify-center items-center space-y-5">
                  <Icons.PlaceholderImage className="h-24 w-24 text-muted-foreground/40" data-ai-hint="food photo" />
                  <p className="text-muted-foreground text-lg">Upload an image or use your camera.</p>
                  <div className="w-full max-w-sm space-y-3 pt-3">
                    <div>
                       <Input 
                        id="food-image-main" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="sr-only"
                      />
                      <Button 
                        type="button" 
                        variant="default"
                        className="w-full py-6 text-base"
                        onClick={() => document.getElementById('food-image-main')?.click()}
                      >
                        <Icons.Upload className="mr-2 h-5 w-5" /> Upload Image
                      </Button>
                    </div>
                    <div className="relative py-1">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted-foreground/20" /></div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-muted/20 px-2 text-muted-foreground">Or</span>
                      </div>
                    </div>
                    <Button type="button" onClick={handleOpenCamera} variant="outline" className="w-full py-6 text-base">
                      <Icons.Camera className="mr-2 h-5 w-5" /> Use Camera
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-4">
              {estimationResult ? (
                <Button onClick={resetEstimationState} className="w-full text-lg py-6" variant="outline">
                    <Icons.Add className="mr-2 h-5 w-5" /> Estimate Another Meal
                </Button>
              ) : (previewUrl && !isCameraOpen && !isLoadingEstimation) ? ( 
                <Button type="submit" disabled={isLoadingEstimation} className="w-full text-lg py-6">
                    <Icons.Flame className="mr-2 h-5 w-5" /> Estimate Calories
                </Button>
              ) : null }
            </CardFooter>
          </form>
        </Card>

        {/* "Talk with NutriAI" Card Removed */}
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Icons.Dashboard className="h-6 w-6 text-primary" />
              Activity Overview
            </CardTitle>
            <CardDescription>
              Your daily progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                  <Icons.Calendar className="h-5 w-5 text-muted-foreground"/> Today's Summary
              </h3>
              {hasMounted ? (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <div className="flex justify-between items-baseline text-2xl font-bold">
                    <span className="text-primary">{todaysCalories.toLocaleString()} kcal</span>
                    <span className="text-sm font-normal text-muted-foreground">consumed</span>
                  </div>
                  <Progress value={progressPercentage} aria-label={`${progressPercentage.toFixed(0)}% of daily calorie goal`} className="h-2.5"/>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 kcal</span>
                    <span>{dailyGoal.toLocaleString()} kcal goal</span>
                  </div>
                  {settings.dailyCalorieGoal === undefined && (
                      <p className="mt-2 text-xs text-muted-foreground text-center">
                      Set your <Link href="/settings" className="text-primary hover:underline font-medium">daily goal</Link>.
                      </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <Skeleton className="h-7 w-24" /><Skeleton className="h-7 w-20" />
                  <Skeleton className="h-2.5 w-full" />
                  <Skeleton className="h-4 w-12" /><Skeleton className="h-4 w-24" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-md font-semibold mb-2 flex items-center gap-2">
                  <Icons.Log className="h-5 w-5 text-muted-foreground"/> Recent Entries
              </h3>
              {hasMounted ? (
                recentLogs.length > 0 ? (
                  <div className="space-y-2">
                    {recentLogs.map(entry => (
                      <Link href="/log" key={entry.id} className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors bg-muted/30">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            {entry.imageUrl && <Image src={entry.imageUrl} alt={entry.foodDescription} width={32} height={32} className="rounded-md object-cover h-8 w-8 flex-shrink-0" data-ai-hint="food meal"/>}
                            <div className="flex-grow min-w-0">
                                <p className="text-sm font-medium truncate" title={entry.foodDescription}>{entry.foodDescription}</p>
                                <p className="text-xs text-muted-foreground">{format(new Date(entry.date), "MMM d, HH:mm")}</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-primary whitespace-nowrap">{entry.calories.toLocaleString()} kcal</span>
                        </div>
                      </Link>
                    ))}
                     <Button variant="link" asChild className="w-full mt-2 text-sm">
                        <Link href="/log">View Full Log & Charts</Link>
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6 border rounded-lg bg-muted/30 text-sm">No log entries yet. <Link href="/log" className="text-primary hover:underline">Add one</Link>.</p>
                )
              ) : (
                <div className="space-y-2 border rounded-lg p-4 bg-muted/30">
                    <Skeleton className="h-12 w-full" /> <Skeleton className="h-10 w-full mt-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
