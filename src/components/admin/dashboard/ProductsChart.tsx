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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ProductsData {
  verified: number;
  notVerified: number;
}

const chartConfig = {
  verified: {
    label: "Verified",
    color: "hsl(var(--chart-1))",
  },
  notVerified: {
    label: "Not Verified",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ProductsChart({ dateRange }: { dateRange?: string }) {
  const [data, setData] = useState<ProductsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const params = dateRange ? `?range=${dateRange}` : "";
        const response = await fetch(`/api/analytics/products${params}`);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [dateRange]);

  // Format data for the chart
  const chartData = data
    ? [
        {
          category: "Products",
          verified: data.verified,
          notVerified: data.notVerified,
        },
      ]
    : [];

  // Calculate trend if needed (placeholder for now)
  const totalProducts = data ? data.verified + data.notVerified : 0;
  const verifiedPercentage =
    data && totalProducts > 0
      ? Math.round((data.verified / totalProducts) * 100)
      : 0;

  const isTrendPositive = verifiedPercentage > 50;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Verification Status</CardTitle>
        <CardDescription>
          {dateRange
            ? `Date range: ${dateRange}`
            : "Current verification breakdown"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        {data && (
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="verified"
                stackId="a"
                fill="var(--color-verified)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="notVerified"
                stackId="a"
                fill="var(--color-notVerified)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {data && (
          <>
            <div className="flex gap-2 font-medium leading-none">
              {isTrendPositive ? (
                <>
                  {verifiedPercentage}% of products are verified{" "}
                  <TrendingUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Only {verifiedPercentage}% of products are verified{" "}
                  <TrendingDown className="h-4 w-4" />
                </>
              )}
            </div>
            <div className="leading-none text-muted-foreground">
              Total products: {totalProducts}
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
