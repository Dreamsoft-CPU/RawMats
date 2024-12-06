import { Check, MapPin, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Supplier, User } from "@prisma/client";
import { useEffect, useState } from "react";
import { retrieveFile } from "@/utils/supabase/files";
import Image from "next/image";
import InlineLoading from "../Loading/InlineLoading";

export function SupplierVerification({
  suppliers,
}: {
  suppliers: (Supplier & { user: User })[];
}) {
  const [files, setFiles] = useState<(string | null)[]>([]);
  const [isLoading, setIsLoading] = useState<{
    status: boolean;
    method: null | "verify" | "reject";
  }>({ status: false, method: null });

  useEffect(() => {
    const fetchFiles = async () => {
      await Promise.all(
        suppliers.map(async (supplier) => {
          const files = await retrieveFile(supplier.userId);

          if (!files) {
            setFiles([]);
          } else {
            setFiles(files);
          }
        }),
      );
    };

    fetchFiles();
  }, [suppliers]);

  const verifySupplier = async (id: string) => {
    setIsLoading({ status: true, method: "verify" });
    try {
      const response = await fetch(`/api/supplier/verify/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to verify supplier");
      }
      alert("Supplier verified successfully.");
    } catch (error) {
      console.error("Error verifying supplier:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An error occurred while verifying the supplier.");
      }
    } finally {
      setIsLoading({ status: false, method: null });
    }
  };

  const rejectSupplier = async (id: string) => {
    setIsLoading({ status: true, method: "reject" });
    try {
      const response = await fetch(`/api/supplier/reject/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to reject supplier");
      }
      alert("Supplier rejected successfully.");
    } catch (error) {
      console.error("Error rejecting supplier:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An error occurred while rejecting the supplier.");
      }
    } finally {
      setIsLoading({ status: false, method: null });
    }
  };

  return (
    <ScrollArea>
      {suppliers.map((supplier) => (
        <Card className="my-3" key={supplier.id}>
          <CardHeader>
            <CardTitle className="text-3xl">{supplier.businessName}</CardTitle>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <div className="flex flex-row gap-2 items-center text-base">
                <UserRound />
                {supplier.user.displayName}
              </div>
              <div className="flex flex-row gap-2 items-center text-base">
                <MapPin />
                <a
                  className="underline"
                  href={supplier.businessLocation}
                  target="_blank"
                >
                  {supplier.businessLocation}
                </a>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Business Documents:</p>
            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
              {files.length === 0 && (
                <Skeleton className="h-[300px] w-[450px] rounded-lg" />
              )}
              {files.map((file, index) =>
                file ? (
                  <Image
                    key={index}
                    src={file}
                    width={100}
                    height={100}
                    alt="business document"
                    className="h-auto w-auto"
                  />
                ) : (
                  <div key={index}>Img not found</div>
                ),
              )}
            </div>
          </CardContent>
          <CardFooter className="flex gap-4 justify-center">
            <Button
              onClick={() => verifySupplier(supplier.userId)}
              disabled={supplier.verified || isLoading.status}
              className="flex-1 bg-rawmats-primary-300 hover:bg-rawmats-feedback-success hover:text-rawmats-text-500 max-w-[25%]"
            >
              {isLoading.method === "verify" ? (
                <InlineLoading message="Verifying" />
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Verify
                </>
              )}
            </Button>
            <Button
              onClick={() => rejectSupplier(supplier.userId)}
              variant="destructive"
              disabled={supplier.verified || isLoading.status}
              className="flex-1 bg-rawmats-feedback-error hover:bg-red-600 max-w-[25%]"
            >
              {isLoading.method === "reject" ? (
                <InlineLoading message="Rejecting" />
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </ScrollArea>
  );
}
