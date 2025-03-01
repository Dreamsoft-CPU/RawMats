"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { type Dispatch, type SetStateAction, useState } from "react";

export default function RejectionDialog({
  rejectionReasons,
  isModalOpen,
  setIsModalOpen,
  rejectFunction,
  rejectID,
  userID,
}: {
  rejectionReasons: string[];
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  rejectFunction: (
    id: string,
    reasons: string[],
    comment: string,
    userID: string,
  ) => Promise<void>;
  rejectID: string;
  userID: string;
}) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [comment, setComment] = useState<string>("");

  const handleReject = () => {
    rejectFunction(rejectID, selectedReasons, comment, userID);
    setIsModalOpen(false);
    setSelectedReasons([]);
    setComment("");
  };

  const handleReasonChange = (reason: string, checked: boolean) => {
    setSelectedReasons((prev) =>
      checked ? [...prev, reason] : prev.filter((r) => r !== reason),
    );
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        setIsModalOpen(open);
        if (!open) {
          setSelectedReasons([]);
          setComment("");
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reject</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Rejection Reasons</Label>
            <div className="grid gap-2">
              {rejectionReasons.map((reason) => (
                <div key={reason} className="flex items-center space-x-2">
                  <Checkbox
                    id={reason}
                    checked={selectedReasons.includes(reason)}
                    onCheckedChange={(checked) =>
                      handleReasonChange(reason, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={reason}
                    className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {reason}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="comment">Additional Comments</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Provide additional details about the rejection..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            className=" hover:bg-red-600"
            onClick={handleReject}
            disabled={selectedReasons.length === 0}
          >
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
