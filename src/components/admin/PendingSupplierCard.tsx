"use client";

import { Check, MapPin, UserRound, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Supplier, User } from "@prisma/client";
import { useState } from "react";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import RejectionDialog from "./RejectionDialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    <div className="p-4 w-full">
      <div className="flex flex-row justify-center md:justify-start items-center md:w-auto relative md:mb-5">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Supplier Verification
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.length === 0 && <p>No supplier applications currently</p>}
        {suppliers.map((supplier) => (
          <Card className="w-full max-w-sm mx-auto" key={supplier.id}>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{supplier.businessName}</CardTitle>
              <div className="flex flex-col gap-1 text-muted-foreground">
                <div className="flex flex-row gap-2 items-center text-sm">
                  <UserRound className="size-4" />
                  {supplier.user.displayName}
                </div>
                <div className="flex flex-row gap-2 items-center text-sm">
                  <MapPin className="size-4 shrink-0" />
                  <a
                    className="underline shrink text-xs"
                    href={supplier.businessLocation}
                    target="_blank"
                  >
                    {supplier.locationName}
                  </a>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm font-medium mb-2">Business Documents:</p>
              <div className="grid grid-cols-3 gap-1">
                {supplier.businessDocuments &&
                supplier.businessDocuments.length > 0 ? (
                  supplier.businessDocuments.slice(0, 3).map((doc, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square cursor-pointer group col-span-1"
                      onClick={toggleOpen(true, supplier.businessDocuments)}
                    >
                      <Image
                        src={doc}
                        alt={
                          idx === 2 && supplier.businessDocuments.length > 3
                            ? `+${supplier.businessDocuments.length - 3} more documents`
                            : `Document ${idx + 1}`
                        }
                        fill
                        className={`object-cover rounded-md ${idx === 2 && supplier.businessDocuments.length > 3 ? "brightness-50" : ""}`}
                      />
                      {idx === 2 && supplier.businessDocuments.length > 3 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-lg font-semibold">
                            +{supplier.businessDocuments.length - 3}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                        <ImageIcon className="text-white size-6" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm col-span-3 text-center">
                    No documents available
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between gap-2 w-full">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  verifySupplier(supplier.userId, supplier.id);
                }}
                disabled={supplier.verified || isLoading.status}
                className="flex-1 hover:bg-green-600 hover:text-white transition-colors"
              >
                {isLoading.method === "verify" ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
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
                className="flex-1 hover:bg-red-700 transition-colors"
              >
                {isLoading.method === "reject" ? (
                  <div className="flex items-center justify-center">
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
      </div>

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
