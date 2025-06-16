
'use client';

import React, { useState } from 'react';
import { useCalorieLog } from '@/hooks/use-calorie-log';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, SubmitHandler } from 'react-hook-form';
import type { LogEntry } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, startOfWeek, startOfMonth, endOfMonth, endOfWeek, eachDayOfInterval, isSameDay, isWithinInterval } from 'date-fns';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip as ChartTooltip } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type ManualEntryFormInputs = {
  foodDescription: string;
  calories: number;
  protein?: number;
  carbohydrates?: number;
  fat?: number;
};

const chartConfig = {
  calories: {
    label: "Calories (kcal)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function LogPage() {
  const { logEntries, addLogEntry, deleteLogEntry } = useCalorieLog();
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ManualEntryFormInputs>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'daily' | 'weekly' | 'monthly'>('list');


  const onSubmitManualEntry: SubmitHandler<ManualEntryFormInputs> = (data) => {
    addLogEntry({
      foodDescription: data.foodDescription,
      calories: Number(data.calories),
      protein: Number(data.protein) || 0,
      carbohydrates: Number(data.carbohydrates) || 0,
      fat: Number(data.fat) || 0,
      estimatedBy: 'user',
    });
    toast({ title: 'Entry Added', description: `${data.foodDescription} logged successfully.` });
    reset();
    setIsDialogOpen(false);
  };

  const handleDeleteEntry = (id: string) => {
    deleteLogEntry(id);
    toast({ title: 'Entry Deleted', description: 'The log entry has been removed.' });
  };

  const aggregateDataForChart = (mode: 'daily' | 'weekly' | 'monthly') => {
    const now = new Date();
    let interval: Interval;
    let dateFormat: string;

    if (mode === 'daily') { 
      interval = { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
      dateFormat = "EEE"; 
    } else if (mode === 'weekly') { 
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      const firstWeekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      const lastWeekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
      interval = {start: firstWeekStart, end: lastWeekEnd};
      dateFormat = "wo"; 
    } else { 
      interval = { start: startOfMonth(new Date(now.getFullYear(), now.getMonth() - 5, 1)), end: endOfMonth(now) };
      dateFormat = "MMM"; 
    }
    
    const daysInInterval = eachDayOfInterval(interval);
    const aggregated = daysInInterval.map(day => {
      const dailyTotal = logEntries
        .filter(entry => isSameDay(parseISO(entry.date), day))
        .reduce((sum, entry) => sum + entry.calories, 0);
      return {
        date: format(day, mode === 'weekly' ? "yyyy-'W'II" : dateFormat), 
        calories: dailyTotal,
      };
    });

    if (mode === 'weekly') {
      const weeklyData: {date: string, calories: number}[] = [];
      const weeks = new Map<string, number>();
      logEntries.forEach(entry => {
        if(isWithinInterval(parseISO(entry.date), interval)){
          const weekLabel = format(startOfWeek(parseISO(entry.date), {weekStartsOn: 1}), "yyyy-'W'II"); 
          weeks.set(weekLabel, (weeks.get(weekLabel) || 0) + entry.calories);
        }
      });
      weeks.forEach((calories, date) => weeklyData.push({date: date.replace('-W', ' Week '), calories}));
      return weeklyData.sort((a,b) => a.date.localeCompare(b.date));
    }
    if (mode === 'monthly') {
      const monthlyData: {date: string, calories: number}[] = [];
      const months = new Map<string, number>();
       logEntries.forEach(entry => {
        if(isWithinInterval(parseISO(entry.date), interval)){
          const monthLabel = format(parseISO(entry.date), "MMM yyyy");
          months.set(monthLabel, (months.get(monthLabel) || 0) + entry.calories);
        }
      });
      months.forEach((calories, date) => monthlyData.push({date, calories}));
      return monthlyData.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return aggregated;
  };
  
  const chartData = viewMode !== 'list' ? aggregateDataForChart(viewMode) : [];

  return (
    <div className="space-y-6 pt-0">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Icons.Log className="h-7 w-7 text-primary" />
              Calorie Log & Charts
            </CardTitle>
            <CardDescription>View, manage your entries, and visualize trends.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
             <Select value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="list">Full Log (List View)</SelectItem>
                <SelectItem value="daily">Daily Chart (This Week)</SelectItem>
                <SelectItem value="weekly">Weekly Chart (This Month)</SelectItem>
                <SelectItem value="monthly">Monthly Chart (Last 6 Months)</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto"><Icons.Add className="mr-2 h-4 w-4" /> Add Manual Entry</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Manual Calorie Entry</DialogTitle>
                  <DialogDescription>Log a meal or snack manually.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitManualEntry)} className="space-y-4">
                  <div>
                    <Label htmlFor="foodDescription">Food Description</Label>
                    <Input id="foodDescription" {...register("foodDescription", { required: "Description is required" })} />
                    {errors.foodDescription && <p className="text-sm text-destructive mt-1">{errors.foodDescription.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="calories">Calories (kcal)</Label>
                    <Input id="calories" type="number" {...register("calories", { required: "Calories are required", valueAsNumber: true, min: {value: 0, message: "Calories must be positive"} })} />
                    {errors.calories && <p className="text-sm text-destructive mt-1">{errors.calories.message}</p>}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                      <div>
                          <Label htmlFor="protein">Protein (g)</Label>
                          <Input id="protein" type="number" {...register("protein", {valueAsNumber: true, min: 0})} />
                      </div>
                      <div>
                          <Label htmlFor="carbohydrates">Carbs (g)</Label>
                          <Input id="carbohydrates" type="number" {...register("carbohydrates", {valueAsNumber: true, min: 0})} />
                      </div>
                      <div>
                          <Label htmlFor="fat">Fat (g)</Label>
                          <Input id="fat" type="number" {...register("fat", {valueAsNumber: true, min: 0})} />
                      </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit">Add Entry</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'list' ? (
            logEntries.length > 0 ? (
              <Table>
                <TableCaption>A list of your recent calorie entries. Scroll for more.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Calories</TableHead>
                    <TableHead className="hidden md:table-cell text-right">Protein</TableHead>
                    <TableHead className="hidden md:table-cell text-right">Carbs</TableHead>
                    <TableHead className="hidden md:table-cell text-right">Fat</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{format(new Date(entry.date), "MMM d, yy HH:mm")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           {entry.imageUrl && <Image src={entry.imageUrl} alt={entry.foodDescription} width={36} height={36} className="rounded-md object-cover h-9 w-9 flex-shrink-0" data-ai-hint="food meal" />}
                            <div className="flex-grow min-w-0">
                               <span className="font-medium block truncate" title={entry.foodDescription}>{entry.foodDescription}</span>
                               <span className="sm:hidden text-xs text-muted-foreground">{format(new Date(entry.date), "MMM d, HH:mm")}</span>
                            </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">{entry.calories.toLocaleString()}</TableCell>
                      <TableCell className="hidden md:table-cell text-right text-sm">{entry.protein.toLocaleString()}g</TableCell>
                      <TableCell className="hidden md:table-cell text-right text-sm">{entry.carbohydrates.toLocaleString()}g</TableCell>
                      <TableCell className="hidden md:table-cell text-right text-sm">{entry.fat.toLocaleString()}g</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteEntry(entry.id)} aria-label="Delete entry">
                          <Icons.Delete className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-lg bg-muted/30 min-h-[300px]">
                <Icons.ClipboardList className="w-16 h-16 mb-6 text-primary/70" />
                <h3 className="mb-2 text-xl font-semibold">Your Calorie Log is Empty</h3>
                <p className="text-muted-foreground max-w-xs">
                  Start tracking by adding a meal manually or use the AI estimator on the Dashboard.
                </p>
                <Button onClick={() => setIsDialogOpen(true)} className="mt-6">
                  <Icons.Add className="w-4 h-4 mr-2" /> Add Manual Entry
                </Button>
              </div>
            )
          ) : (
             chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="min-h-[300px] w-full aspect-video">
                    <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                        dataKey="date"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                        <ChartTooltip
                            cursor={true}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="calories" fill="var(--color-calories)" radius={viewMode === 'daily' ? 8 : 4} />
                    </BarChart>
                </ChartContainer>
             ) : (
                 <p className="text-muted-foreground text-center py-12">Not enough data to display {viewMode} chart. Please add more log entries.</p>
             )
          )}
        </CardContent>
      </Card>
    </div>
  );
}

