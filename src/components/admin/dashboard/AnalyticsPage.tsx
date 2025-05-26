"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { Download } from "lucide-react";

// Import the chart components
import { NewUsersChart } from "./NewUsersChart";
import { SuppliersChart } from "./SuppliersChart";
import { ProductsChart } from "./ProductsChart";
import { TopSuppliersChart } from "./TopSuppliersChart";
import { toast } from "sonner";

const AnalyticsPage = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const range = useMemo(
    () =>
      date
        ? `${format(date.from || new Date(), "yyyy-MM-dd")},${format(
            date.to || new Date(),
            "yyyy-MM-dd",
          )}`
        : null,
    [date],
  );

  const handleDownload = async () => {
    const response = await fetch("/api/analytics/download", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        range:
          range ??
          `${format(subDays(new Date(), 30), "yyyy-MM-dd")},${format(new Date(), "yyyy-MM-dd")}`,
      }),
    });

    if (!response.ok) {
      toast.error("Failed to download data");
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rawmats_analytics_${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-col flex p-4">
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between flex-col lg:flex-row">
          <div className="flex flex-row justify-center items-center w-full md:w-auto">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <div className="flex flex-col lg:flex-row justify-center items-center space-y-2 lg:space-y-0 lg:space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "PPP")} - {format(date.to, "PPP")}
                      </>
                    ) : (
                      format(date.from, "PPP")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Button
              onClick={() =>
                setDate(
                  range
                    ? undefined
                    : {
                        from: subDays(new Date(), 30),
                        to: new Date(),
                      },
                )
              }
            >
              {range ? "Lifetime" : "This month"}
            </Button>
            <Button
              onClick={handleDownload}
              className="bg-green-700 hover:bg-green-800"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        {/* First row of charts */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="col-span-1">
            <NewUsersChart dateRange={range ?? undefined} />
          </div>
          <div className="col-span-1">
            <SuppliersChart dateRange={range ?? undefined} />
          </div>
          <div className="col-span-1">
            <ProductsChart dateRange={range ?? undefined} />
          </div>
        </div>

        {/* Top suppliers chart in the second row */}
        <div className="grid gap-4">
          <TopSuppliersChart dateRange={range ?? undefined} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
