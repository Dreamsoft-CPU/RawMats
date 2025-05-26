"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

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

type SupplierStats = {
  verified: number;
  notVerified: number;
};

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

export function SuppliersChart({ dateRange }: { dateRange?: string }) {
  const [supplierData, setSupplierData] = useState<SupplierStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Building the URL with date range parameter
        const params = dateRange ? `?range=${dateRange}` : "";
        const response = await fetch(`/api/analytics/suppliers${params}`);

        if (!response.ok) {
          throw new Error("Failed to fetch supplier data");
        }

        const data: SupplierStats = await response.json();
        setSupplierData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const chartData = supplierData
    ? [
        {
          verified: supplierData.verified,
          notVerified: supplierData.notVerified,
        },
      ]
    : [];

  const totalSuppliers = supplierData
    ? supplierData.verified + supplierData.notVerified
    : 0;
  const verifiedPercentage =
    totalSuppliers > 0
      ? Math.round(((supplierData?.verified || 0) / totalSuppliers) * 100)
      : 0;

  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col">
        <CardContent>Error: {error}</CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Suppliers Verification</CardTitle>
        <CardDescription>Verification Status Overview</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalSuppliers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Suppliers
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="verified"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-verified)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="notVerified"
              fill="var(--color-notVerified)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {verifiedPercentage > 50 ? (
            <>
              Verified: {verifiedPercentage}%{" "}
              <TrendingUp className="h-4 w-4 text-green-500" />
            </>
          ) : (
            <>
              Verified: {verifiedPercentage}%{" "}
              <TrendingDown className="h-4 w-4 text-amber-500" />
            </>
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total suppliers and verification status
          {dateRange && ` for ${dateRange}`}
        </div>
      </CardFooter>
    </Card>
  );
}
