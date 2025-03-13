"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Give Feedback</DialogTitle>
          <p className="text-sm text-gray-500">Your feedback helps us improve!</p>
        </DialogHeader>

        <div className="flex gap-1 justify-center py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-8 h-8 cursor-pointer text-gray-300 hover:text-yellow-400" />
          ))}
        </div>

        <div>
          <label className="text-sm font-medium">Do you have any thoughts you would like to share?</label>
          <Textarea placeholder="Write your feedback here..." className="mt-2" />
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
