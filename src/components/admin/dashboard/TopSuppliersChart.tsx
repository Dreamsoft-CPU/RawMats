"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

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

type SupplierData = {
  businessName: string;
  businessLocation: string;
  locationName: string;
  productCount: number;
};

const chartConfig = {
  productCount: {
    label: "Products",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TopSuppliersChart({ dateRange }: { dateRange?: string }) {
  const [supplierData, setSupplierData] = useState<SupplierData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const params = dateRange ? `?range=${dateRange}` : "";
        const response = await fetch(`/api/analytics/top-suppliers${params}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setSupplierData(data);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "An error occurred";
        toast.error(`Failed to fetch top suppliers: ${message}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [dateRange]);

  const chartData = supplierData.map((supplier) => ({
    name: supplier.businessName || "Unknown",
    productCount: supplier.productCount,
    location: supplier.locationName || "Unknown",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Suppliers</CardTitle>
        <CardDescription>By verified products</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            Loading...
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  value.length > 10 ? `${value.slice(0, 10)}...` : value
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="productCount"
                fill="var(--color-productCount)"
                radius={8}
              >
                <LabelList
                  dataKey="productCount"
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Showing top 5 suppliers by verified product count
      </CardFooter>
    </Card>
  );
}
