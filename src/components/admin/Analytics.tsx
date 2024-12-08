import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DatePickerWithRange } from "../ui/date-range-picker";
import useSWR from "swr";
import { format, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { PackageSearch, UserCog, Users } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function Loader() {
  return (
    <div className="flex flex-row gap-2 items-center">
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="text-lg font-bold">Loading</p>
    </div>
  );
}

export default function Analytics() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const range = date
    ? `${format(date.from || new Date(), "yyyy-MM-dd")},${format(
        date.to || new Date(),
        "yyyy-MM-dd",
      )}`
    : null;

  const {
    data: newUsers,
    error: newUserError,
    isLoading: newUserLoading,
  } = useSWR<number>(
    `/api/analytics/new-users${range ? "?range=" + range : ""}`,
    fetcher,
  );

  const {
    data: suppliers,
    error: supplierError,
    isLoading: supplierLoading,
  } = useSWR<{ verified: number; notVerified: number }>(
    `/api/analytics/suppliers${range ? "?range=" + range : ""}`,
    fetcher,
  );

  const {
    data: products,
    error: productError,
    isLoading: productLoading,
  } = useSWR<{ verified: number; notVerified: number }>(
    `/api/analytics/products${range ? "?range=" + range : ""}`,
    fetcher,
  );

  const {
    data: topSuppliers,
    error: topSupplierError,
    isLoading: topSupplierLoading,
  } = useSWR<
    {
      productCount: number;
      businessName: string | undefined;
      businessLocation: string | undefined;
    }[]
  >(`/api/analytics/top-suppliers${range ? "?range=" + range : ""}`, fetcher);

  console.log(topSuppliers);

  return (
    <>
      <div className="flex-col flex">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between space-y-2 flex-col lg:flex-row">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex flex-col lg:flex-row justify-center items-center space-y-2 lg:space-y-0 lg:space-x-2">
              <div className="flex flex-row gap-2">
                <DatePickerWithRange date={date} setDate={setDate} />
                {range ? (
                  <Button onClick={() => setDate(undefined)}>Lifetime</Button>
                ) : (
                  <Button
                    onClick={() =>
                      setDate({
                        from: subDays(new Date(), 30),
                        to: new Date(),
                      })
                    }
                  >
                    This month
                  </Button>
                )}
              </div>
              <Button className="bg-green-700 hover:bg-green-800">
                Download
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {newUserLoading ? (
                  <Loader />
                ) : newUserError ? (
                  <div className="text-2xl font-bold">
                    Failed to load, try again later
                  </div>
                ) : newUsers !== undefined ? (
                  <>
                    <div className="text-2xl font-bold">{newUsers} </div>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      {range
                        ? `new user${newUsers !== 1 ? "s" : ""} from the specified range`
                        : `total user${newUsers !== 1 ? "s" : ""}`}
                    </p>
                  </>
                ) : (
                  <div className="text-2xl font-bold">No data available</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
                <UserCog className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {supplierLoading ? (
                  <Loader />
                ) : supplierError ? (
                  <div className="text-2xl font-bold">
                    Failed to load, try again later
                  </div>
                ) : suppliers ? (
                  <>
                    <div className="text-2xl font-bold">
                      {suppliers.verified}{" "}
                      <span className="text-sm lg:text-base font-normal">
                        supplier{suppliers.verified !== 1 ? "s" : ""} verified
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {suppliers.notVerified}{" "}
                      <span className="text-sm lg:text-base font-normal">
                        supplier{suppliers.notVerified !== 1 ? "s" : ""} not
                        verified
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-2xl font-bold">No data available</div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <PackageSearch className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {productLoading ? (
                  <Loader />
                ) : productError ? (
                  <div className="text-2xl font-bold">
                    Failed to load, try again later
                  </div>
                ) : products ? (
                  <>
                    <div className="text-2xl font-bold">
                      {products.verified}{" "}
                      <span className="text-sm lg:text-base font-normal">
                        product{products.verified !== 1 ? "s" : ""} verified
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {products.notVerified}{" "}
                      <span className="text-sm lg:text-base font-normal">
                        product{products.notVerified !== 1 ? "s" : ""} not
                        verified
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-2xl font-bold">No data available</div>
                )}
              </CardContent>
            </Card>
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold flex flex-col md:flex-row md:items-center md:gap-3 mb-2">
                  Top Suppliers
                  <div className="font-medium text-xs lg:text-sm text-muted-foreground">
                    {range
                      ? `from the specified range`
                      : `lifetime top suppliers`}
                  </div>
                </CardTitle>
                <div className="text-sm font-medium text-right">
                  Product Count
                </div>
              </CardHeader>
              <CardContent>
                {topSupplierLoading ? (
                  <Loader />
                ) : topSupplierError ? (
                  <div className="text-2xl font-bold">
                    Failed to load, try again later
                  </div>
                ) : topSuppliers && topSuppliers.length > 0 ? (
                  <div className="space-y-4">
                    {topSuppliers.map((supplier, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2 font-medium text-base">
                            <span>{index + 1}.</span>
                            <span>{supplier.businessName}</span>
                          </div>
                          <a
                            className="block text-sm text-muted-foreground underline"
                            href={supplier.businessLocation}
                            target="_blank"
                          >
                            {supplier.businessLocation}
                          </a>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{supplier.productCount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-2xl font-bold">No data available</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
