"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
import { toast } from "sonner";

const chartConfig = {
  users: {
    label: "New Users",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function NewUsersChart({ dateRange }: { dateRange?: string }) {
  const [chartData, setChartData] = useState<
    Array<{ month: string; users: number }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trend, setTrend] = useState<{ value: number; isUp: boolean }>({
    value: 0,
    isUp: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = dateRange ? `?range=${dateRange}` : "";
        const response = await fetch(`/api/analytics/new-users${params}`);

        if (!response.ok) throw new Error("Failed to fetch data");
        const newUserCount = await response.json();

        // Process data into monthly format
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        // For demonstration - format data based on current date
        // In production this would use actual API response data
        const formattedData = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date();
          date.setMonth(date.getMonth() - i);
          formattedData.push({
            month: months[date.getMonth()],
            users: Math.floor(newUserCount / 6), // Dividing by 6 months as placeholder
          });
        }

        setChartData(formattedData);

        // Calculate trend
        const lastMonthUsers = formattedData[formattedData.length - 1].users;
        const previousMonthUsers =
          formattedData[formattedData.length - 2]?.users || 0;
        if (previousMonthUsers > 0) {
          const trendValue =
            ((lastMonthUsers - previousMonthUsers) / previousMonthUsers) * 100;
          setTrend({
            value: Math.abs(parseFloat(trendValue.toFixed(1))),
            isUp: lastMonthUsers >= previousMonthUsers,
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        toast.error(`Failed to fetch new user data: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Users</CardTitle>
        <CardDescription>By registration date</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            Loading data...
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="users" fill="var(--color-users)" radius={8} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trend.isUp ? (
            <>
              Trending up by {trend.value}% this month{" "}
              <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Trending down by {trend.value}% this month{" "}
              <TrendingDown className="h-4 w-4" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing new user registrations for the selected period
        </div>
      </CardFooter>
    </Card>
  );
}
