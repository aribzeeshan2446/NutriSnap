
'use client';

import React, { useEffect } from 'react';
import { useUserSettings } from '@/hooks/use-user-settings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import type { UserSettings } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const activityLevels: UserSettings['activityLevel'][] = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
const genders: UserSettings['gender'][] = ['male', 'female', 'other'];


export default function SettingsPage() {
  const { settings, setSettings } = useUserSettings();
  const { toast } = useToast();

  const { control, register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<UserSettings>({
    defaultValues: settings,
  });

  useEffect(() => {
    reset(settings);
  }, [settings, reset]);

  const onSubmit: SubmitHandler<UserSettings> = (data) => {
    const updatedSettings: UserSettings = {
        name: data.name || 'User', 
        age: data.age ? Number(data.age) : undefined,
        weight: data.weight ? Number(data.weight) : undefined,
        height: data.height ? Number(data.height) : undefined,
        gender: data.gender,
        activityLevel: data.activityLevel,
        dailyCalorieGoal: data.dailyCalorieGoal ? Number(data.dailyCalorieGoal) : undefined,
        dailyProteinGoal: data.dailyProteinGoal ? Number(data.dailyProteinGoal) : undefined,
        dailyCarbsGoal: data.dailyCarbsGoal ? Number(data.dailyCarbsGoal) : undefined,
        dailyFatGoal: data.dailyFatGoal ? Number(data.dailyFatGoal) : undefined,
    };
    setSettings(updatedSettings);
    toast({ title: 'Settings Saved', description: 'Your preferences have been updated.' });
    reset(updatedSettings); 
  };


  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
            <Icons.Settings className="h-8 w-8 text-primary" />
            User Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your profile and nutritional goals.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
            <Card className="shadow-md">
              <CardHeader><CardTitle className="text-xl">Personal Information</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" {...register("name")} placeholder="Your Name" />
                </div>
                <div>
                  <Label htmlFor="age">Age (years)</Label>
                  <Input id="age" type="number" {...register("age", { valueAsNumber: true, min: { value: 1, message: "Age must be positive" }})} placeholder="e.g., 30" />
                  {errors.age && <p className="text-sm text-destructive mt-1">{errors.age.message}</p>}
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input id="weight" type="number" step="0.1" {...register("weight", { valueAsNumber: true, min: { value: 1, message: "Weight must be positive" }})} placeholder="e.g., 70.5" />
                  {errors.weight && <p className="text-sm text-destructive mt-1">{errors.weight.message}</p>}
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input id="height" type="number" {...register("height", { valueAsNumber: true, min: { value: 1, message: "Height must be positive" }})} placeholder="e.g., 175" />
                  {errors.height && <p className="text-sm text-destructive mt-1">{errors.height.message}</p>}
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
                            <SelectContent>
                                {genders.map(g => <SelectItem key={g} value={g} className="capitalize">{g}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}
                  />
                </div>
                <div>
                  <Label htmlFor="activityLevel">Activity Level</Label>
                   <Controller
                    name="activityLevel"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger id="activityLevel"><SelectValue placeholder="Select activity level" /></SelectTrigger>
                            <SelectContent>
                                {activityLevels.map(level => <SelectItem key={level} value={level} className="capitalize">{level.replace('_', ' ')}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader><CardTitle className="text-xl">Nutritional Goals</CardTitle></CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <Label htmlFor="dailyCalorieGoal">Daily Calorie Goal (kcal)</Label>
                  <Input id="dailyCalorieGoal" type="number" {...register("dailyCalorieGoal", { valueAsNumber: true, min: { value: 0, message: "Goal must be non-negative" } })} placeholder="e.g., 2000" />
                  {errors.dailyCalorieGoal && <p className="text-sm text-destructive mt-1">{errors.dailyCalorieGoal.message}</p>}
                </div>
                 <div>
                  <Label htmlFor="dailyProteinGoal">Daily Protein Goal (g)</Label>
                  <Input id="dailyProteinGoal" type="number" {...register("dailyProteinGoal", { valueAsNumber: true, min: { value: 0, message: "Goal must be non-negative" } })} placeholder="e.g., 100" />
                </div>
                 <div>
                  <Label htmlFor="dailyCarbsGoal">Daily Carbohydrates Goal (g)</Label>
                  <Input id="dailyCarbsGoal" type="number" {...register("dailyCarbsGoal", { valueAsNumber: true, min: { value: 0, message: "Goal must be non-negative" } })} placeholder="e.g., 250" />
                </div>
                 <div>
                  <Label htmlFor="dailyFatGoal">Daily Fat Goal (g)</Label>
                  <Input id="dailyFatGoal" type="number" {...register("dailyFatGoal", { valueAsNumber: true, min: { value: 0, message: "Goal must be non-negative" } })} placeholder="e.g., 70"/>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={!isDirty} size="lg">
                <Icons.Upload className="mr-2 h-5 w-5" /> Save All Settings
              </Button>
            </div>
        </div>
        </form>
            
        <Card className="shadow-md mt-8">
            <CardHeader><CardTitle className="text-xl">General Nutrition Information</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>Daily calorie needs vary based on age, sex, height, weight, activity level, and metabolic health. Typical ranges are 1600-2400 kcal for adult women and 2000-3000 kcal for adult men.</p>
            <p>A balanced macronutrient distribution is generally:</p>
            <ul className="list-disc list-inside pl-4 space-y-1">
                <li><strong>Carbohydrates:</strong> 45-65% of total daily calories.</li>
                <li><strong>Protein:</strong> 10-35% of total daily calories (or 0.8g per kg of body weight).</li>
                <li><strong>Fat:</strong> 20-35% of total daily calories.</li>
            </ul>
            <p>This information is for general guidance. Consult a nutritionist or healthcare provider for personalized advice tailored to your specific needs and health conditions.</p>
            </CardContent>
        </Card>
    </div>
  );
}
