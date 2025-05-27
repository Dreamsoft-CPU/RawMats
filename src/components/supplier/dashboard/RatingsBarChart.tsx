"use client";

import { Calendar as CalendarIcon, TrendingUp, Star } from "lucide-react";
import { addDays } from "date-fns";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { DateRange } from "react-day-picker";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { UserDataProps } from "@/lib/interfaces/ProductListProps";

const chartConfig = {
  "1": {
    label: "1 Star",
    color: "hsl(var(--chart-1))",
  },
  "2": {
    label: "2 Stars",
    color: "hsl(var(--chart-2))",
  },
  "3": {
    label: "3 Stars",
    color: "hsl(var(--chart-3))",
  },
  "4": {
    label: "4 Stars",
    color: "hsl(var(--chart-4))",
  },
  "5": {
    label: "5 Stars",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

// Define types for the chart data structure
interface RatingCounts {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

interface ChartDataItem extends RatingCounts {
  month: string;
}

export const RatingsBarChart: React.FC<UserDataProps> = ({ userData }) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  // Process userData to extract ratings by time period
  const getRatingsChartData = (): ChartDataItem[] => {
    // Get all ratings from all products
    const allRatings = userData.Supplier.flatMap((supplier) =>
      supplier.Product.flatMap((product) => product.ratings),
    );

    // Filter ratings based on date range
    const filteredRatings = allRatings.filter((rating) => {
      const ratingDate = new Date(rating.createdAt);
      return (
        (!dateRange?.from || ratingDate >= dateRange.from) &&
        (!dateRange?.to || ratingDate <= dateRange.to)
      );
    });

    // Group ratings by month and rating value
    const ratingsByMonth = filteredRatings.reduce(
      (acc, rating) => {
        const date = new Date(rating.createdAt);
        const month = date.toLocaleString("default", { month: "short" });

        if (!acc[month]) {
          acc[month] = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
        }

        const ratingKey = rating.rating.toString() as keyof RatingCounts;
        acc[month][ratingKey]++;
        return acc;
      },
      {} as Record<string, RatingCounts>,
    );

    // Convert to chart data format
    return Object.entries(ratingsByMonth).map(([month, ratings]) => ({
      month,
      ...ratings,
    }));
  };

  const chartData = getRatingsChartData();

  // Calculate average rating and trend
  const calculateAverageRating = (): string => {
    const allRatings = userData.Supplier.flatMap((supplier) =>
      supplier.Product.flatMap((product) => product.ratings),
    );

    if (allRatings.length === 0) return "0";

    const sum = allRatings.reduce((acc, rating) => acc + rating.rating, 0);
    return (sum / allRatings.length).toFixed(1);
  };

  const calculateTrend = (): string => {
    if (chartData.length < 2) return "0";

    const currentData = chartData[chartData.length - 1];
    const previousData = chartData[chartData.length - 2];

    if (!currentData || !previousData) return "0";

    const currentAvg =
      (currentData["1"] * 1 +
        currentData["2"] * 2 +
        currentData["3"] * 3 +
        currentData["4"] * 4 +
        currentData["5"] * 5) /
      (currentData["1"] +
        currentData["2"] +
        currentData["3"] +
        currentData["4"] +
        currentData["5"]);

    const previousAvg =
      (previousData["1"] * 1 +
        previousData["2"] * 2 +
        previousData["3"] * 3 +
        previousData["4"] * 4 +
        previousData["5"] * 5) /
      (previousData["1"] +
        previousData["2"] +
        previousData["3"] +
        previousData["4"] +
        previousData["5"]);

    if (isNaN(currentAvg) || isNaN(previousAvg) || previousAvg === 0)
      return "0";

    const trendPercentage = ((currentAvg - previousAvg) / previousAvg) * 100;
    return trendPercentage.toFixed(1);
  };

  const averageRating = calculateAverageRating();
  const trend = calculateTrend();
  const isTrendingUp = parseFloat(trend) >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Ratings Overview
          </CardTitle>
          <CardDescription>
            Rating distribution across time periods
          </CardDescription>
        </div>
        <div className="w-full md:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full md:w-[300px] justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Average Rating:
            </span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{averageRating}</span>
            </div>
          </div>
        </div>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="1" stackId="ratings" fill="var(--color-1)" />
            <Bar dataKey="2" stackId="ratings" fill="var(--color-2)" />
            <Bar dataKey="3" stackId="ratings" fill="var(--color-3)" />
            <Bar dataKey="4" stackId="ratings" fill="var(--color-4)" />
            <Bar dataKey="5" stackId="ratings" fill="var(--color-5)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {isTrendingUp
                ? `Trending up by ${trend}%`
                : `Trending down by ${Math.abs(parseFloat(trend))}%`}{" "}
              this month
              <TrendingUp
                className={`h-4 w-4 ${!isTrendingUp ? "rotate-180 text-red-500" : "text-green-500"}`}
              />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {chartData.length > 0
                ? `${chartData[0]?.month || ""} - ${chartData[chartData.length - 1]?.month || ""}`
                : "No data available"}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
