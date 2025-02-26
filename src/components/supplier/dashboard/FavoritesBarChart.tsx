"use client";

import { Calendar as CalendarIcon, TrendingUp } from "lucide-react";
import { addDays } from "date-fns";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
  favorites: {
    label: "Favorites",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const FavoritesBarChart: React.FC<UserDataProps> = ({ userData }) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  // Process userData to extract favorites by month
  const getFavoritesChartData = () => {
    // Get all favorites from all products
    const allFavorites = userData.Supplier.flatMap((supplier) =>
      supplier.Product.flatMap((product) => product.favorites),
    );

    // Filter favorites based on date range
    const filteredFavorites = allFavorites.filter((favorite) => {
      const favoriteDate = new Date(favorite.createdAt);
      return (
        (!dateRange?.from || favoriteDate >= dateRange.from) &&
        (!dateRange?.to || favoriteDate <= dateRange.to)
      );
    });

    // Group favorites by month
    const favoritesByMonth = filteredFavorites.reduce(
      (acc, favorite) => {
        const date = new Date(favorite.createdAt);
        const month = date.toLocaleString("default", { month: "long" });

        if (!acc[month]) {
          acc[month] = 0;
        }

        acc[month]++;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Convert to chart data format
    return Object.entries(favoritesByMonth).map(([month, count]) => ({
      month,
      favorites: count,
    }));
  };

  const chartData = getFavoritesChartData();

  // Calculate trend percentage
  const calculateTrend = () => {
    if (chartData.length < 2) return "0";

    const currentMonth = chartData[chartData.length - 1]?.favorites || 0;
    const previousMonth = chartData[chartData.length - 2]?.favorites || 0;

    if (previousMonth === 0) return "0";

    const trendPercentage =
      ((currentMonth - previousMonth) / previousMonth) * 100;
    return trendPercentage.toFixed(1);
  };

  const trend = calculateTrend();
  const isTrendingUp = parseFloat(trend) >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Favorites Overview</CardTitle>
          <CardDescription>
            Showing favorite counts across time periods
          </CardDescription>
        </div>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
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
        <ChartContainer config={chartConfig}>
          <AreaChart
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
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="favorites"
              type="natural"
              fill="var(--color-favorites)"
              fillOpacity={0.4}
              stroke="var(--color-favorites)"
            />
          </AreaChart>
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
