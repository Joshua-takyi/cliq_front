import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProduct";
import { TrashIcon } from "@heroicons/react/24/outline";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const DeleteProduct = ({ productId }: { productId: string }) => {
  // Get the deleteProduct mutation object from the custom hook
  const { deleteProduct } = useProduct();
  const queryClient = new QueryClient();
  // Destructure the mutate function and isPending state from the mutation object
  const { mutate, isPending } = deleteProduct;

  // Function to handle the deletion of a product
  const handleDelete = async () => {
    try {
      // Call the deleteProduct mutation with the productId
      await mutate(productId);
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Error deleting product");
      console.error("Error deleting product:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {/* Button to open the delete confirmation dialog */}
        <Button
          variant="outline"
          disabled={isPending}
          className="cursor-pointer"
        >
          {isPending ? "Processing..." : <TrashIcon />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* Button to cancel the deletion */}
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          {/* Trigger the deleteProduct mutation with the productId when the "Delete" button is clicked */}
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
