"use client";

import { useAdminActions } from "@/hooks/adminActions";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface UpdateStatusProps {
  _id: string;
  deliveryStatus: string;
}

const StatusOptions = [
  { output: "Pending", value: "pending" },
  { output: "Processing", value: "processing" },
  { output: "Shipped", value: "shipped" },
  { output: "Delivered", value: "delivered" },
  { output: "Cancelled", value: "cancelled" },
];

const newLocal = "w-[150px]";
export const UpdateStatus = ({ _id, deliveryStatus }: UpdateStatusProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(deliveryStatus);
  const { updateOrderStatus } = useAdminActions();
  const { mutate, isPending } = updateOrderStatus;

  const handleUpdateStatus = () => {
    // Validate that both order ID and selected status exist before proceeding
    if (!_id || !selectedStatus) {
      toast.error("Order ID and status are required to update delivery status");
      return;
    }

    // Make API call to update order status - note: backend expects 'id' not '_id'
    mutate(
      { id: _id, deliveryStatus: selectedStatus },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          setIsDialogOpen(false);
        },
        onError: (error: Error) => {
          toast.error(
            error.message || "Failed to update order status. Please try again.",
          );
        },
      },
    );
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <Select
        onValueChange={handleStatusChange}
        defaultValue={deliveryStatus}
        disabled={isPending}
      >
        <SelectTrigger className={newLocal}>
          <SelectValue placeholder="Update status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            {StatusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.output}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Status Update</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the status to{" "}
              {StatusOptions.find((opt) => opt.value === selectedStatus)
                ?.output || selectedStatus}
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpdateStatus}
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
