"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the data structure for the chart
export interface SalesDataPoint {
  date: string;
  amount: number;
}

// Group data by different time intervals
interface SalesChartProps {
  dailyData: SalesDataPoint[];
  weeklyData: SalesDataPoint[];
  monthlyData: SalesDataPoint[];
  yearlyData: SalesDataPoint[];
}

const SalesChart: React.FC<SalesChartProps> = ({
  dailyData,
  weeklyData,
  monthlyData,
  yearlyData,
}) => {
  const [activeTab, setActiveTab] = useState("monthly");

  // Function to get the active data based on the selected time frame
  const getActiveData = () => {
    switch (activeTab) {
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "yearly":
        return yearlyData;
      case "monthly":
      default:
        return monthlyData;
    }
  };

  // Function to format the tooltip label
  const formatTooltipLabel = (value: any) => {
    return `₱${Number(value).toFixed(2)}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-primary-500">
              Sales Overview
            </CardTitle>
            <CardDescription>
              Summary of all supplier sales over time
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-4 w-[400px]">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getActiveData()}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `₱${value}`} />
                  <Tooltip formatter={formatTooltipLabel} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    name="Sales Amount"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
