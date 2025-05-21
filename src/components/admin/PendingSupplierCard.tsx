"use client";

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
import { Supplier, User } from "@prisma/client";
import { useState } from "react";

import Lightbox from "yet-another-react-lightbox";
import Inline from "yet-another-react-lightbox/plugins/inline";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import RejectionDialog from "./RejectionDialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SupplierVerificationComponent({
  suppliers,
}: {
  suppliers: (Supplier & { user: User })[];
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [currentDocuments, setCurrentDocuments] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<{
    supplierID: string;
    userID: string;
  }>({ supplierID: "", userID: "" });
  const router = useRouter();

  const toggleOpen = (state: boolean, documents?: string[]) => () => {
    if (state && documents) {
      setCurrentDocuments(documents);
    }
    setOpen(state);
  };

  const updateIndex = ({ index: current }: { index: number }) =>
    setIndex(current);

  const [isLoading, setIsLoading] = useState<{
    status: boolean;
    method: null | "verify" | "reject";
  }>({ status: false, method: null });

  const openRejectModal = (supplierID: string, userID: string) => {
    setSelectedSupplier({ supplierID, userID });
    setIsModalOpen(true);
  };

  const verifySupplier = async (userId: string, supplierId: string) => {
    setIsLoading({ status: true, method: "verify" });
    try {
      const response = await fetch(`/api/admin/verify/supplier`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          id: supplierId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify supplier");
      }
      toast.success("Supplier verified successfully.");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(`Error verifying supplier: ${message}`);
    } finally {
      setIsLoading({ status: false, method: null });
    }
  };

  const rejectSupplier = async (
    supplierID: string,
    reasons: string[],
    comment: string,
    userID: string,
  ) => {
    setIsLoading({ status: true, method: "reject" });
    try {
      const response = await fetch(`/api/admin/verify/supplier`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: supplierID,
          reasons,
          comment,
          userId: userID,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject supplier");
      }
      toast.success("Supplier rejected successfully.");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(`Error rejecting supplier: ${message}`);
    } finally {
      setIsLoading({ status: false, method: null });
    }
  };

  return (
    <div className="p-4 w-full h-screen">
      <div className="flex flex-row justify-center md:justify-start items-center md:w-auto relative md:mb-5">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Supplier Verification
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2"></div>
      {suppliers.length === 0 && <p>No supplier applications currently</p>}
      {suppliers.map((supplier) => (
        <Card className="my-3 max-w-3xl" key={supplier.id}>
          <CardHeader>
            <CardTitle className="text-xl md:text-3xl">
              {supplier.businessName}
            </CardTitle>
            <div className="flex flex-col gap-2 text-muted-foreground">
              <div className="flex flex-row gap-2 items-center text-sm md:text-base">
                <UserRound className="size-4 sm:size-5 md:size-6" />
                {supplier.user.displayName}
              </div>
              <div className="flex flex-row gap-2 items-center text-[10px] md:text-base">
                <MapPin className="size-4 sm:size-5 md:size-6 shrink-0" />
                <a
                  className="underline shrink"
                  href={supplier.businessLocation}
                  target="_blank"
                >
                  {supplier.locationName}
                </a>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-base md:text-lg">Business Documents:</p>
            <div className="w-full max-h-[400px] flex">
              {supplier.businessDocuments &&
              supplier.businessDocuments.length > 0 ? (
                <>
                  <Lightbox
                    index={index}
                    slides={supplier.businessDocuments.map((doc) => ({
                      src: doc,
                    }))}
                    plugins={[Inline]}
                    on={{
                      view: updateIndex,
                      click: toggleOpen(true, supplier.businessDocuments),
                    }}
                    carousel={{
                      padding: 0,
                      spacing: 10,
                      imageFit: "contain",
                      finite: true,
                    }}
                    inline={{
                      style: {
                        width: "100%",
                        maxWidth: "700px",
                        aspectRatio: "3 / 2",
                        maxHeight: "400px",
                        objectFit: "contain",
                      },
                    }}
                  />

                  <Lightbox
                    open={open}
                    close={toggleOpen(false)}
                    index={index}
                    plugins={[Zoom]}
                    slides={currentDocuments.map((doc) => ({
                      src: doc,
                    }))}
                    on={{ view: updateIndex }}
                    animation={{ fade: 0 }}
                    controller={{
                      closeOnPullDown: true,
                      closeOnBackdropClick: true,
                    }}
                    zoom={{
                      scrollToZoom: true,
                      maxZoomPixelRatio: 10,
                      wheelZoomDistanceFactor: 200,
                      pinchZoomDistanceFactor: 200,
                    }}
                  />
                </>
              ) : (
                <Skeleton className="h-[350px] w-[500px] rounded-lg" />
              )}
            </div>
          </CardContent>
          <CardFooter className="flex gap-4 justify-start">
            <Button
              onClick={() => verifySupplier(supplier.userId, supplier.id)}
              disabled={supplier.verified || isLoading.status}
              className="flex-1 hover:bg-rawmats-primary-100 min-w-[100px] max-w-[150px]"
            >
              {isLoading.method === "verify" ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent border-rawmats-primary-100 animate-spin"></div>
                  <span>Verifying</span>
                </div>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Verify
                </>
              )}
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openRejectModal(supplier.id, supplier.userId);
              }}
              variant="destructive"
              disabled={supplier.verified || isLoading.status}
              className="flex-1 min-w-[100px] max-w-[150px]"
            >
              {isLoading.method === "reject" ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                  <span>Rejecting</span>
                </div>
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

      <RejectionDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        rejectFunction={rejectSupplier}
        rejectID={selectedSupplier.supplierID}
        userID={selectedSupplier.userID}
        rejectionReasons={[
          "Incomplete business documents",
          "Invalid business registration",
          "Inconsistent or misleading information",
          "Poor image quality",
        ]}
      />
    </div>
  );
}
