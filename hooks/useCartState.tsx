// "use client";

// import { useState, useEffect } from "react";
// import { UseCart } from "./useCart";
// import { useQueryClient } from "@tanstack/react-query";

// /**
//  * Custom hook for managing cart state in the client
//  * Provides methods for adding, removing, and updating items in the cart
//  */
// export const useCart = () => {
//   // Define cart item type
//   interface CartItem {
//     id: string;
//     name: string;
//     price: number;
//     quantity: number;
//     images?: string[];
//     selectedColor?: string;
//   }

//   // Initialize state
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [cartTotal, setCartTotal] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);

//   // Get cart methods from API hook
//   const { GetCart, AddToCart } = UseCart();
//   const queryClient = useQueryClient();

//   // Load cart data from API
//   const { data } = GetCart;

//   // Add item to cart
//   const addItem = (item: CartItem) => {
//     // Check if item already exists in cart
//     const existingItemIndex = cart.findIndex(
//       (cartItem) =>
//         cartItem.id === item.id && cartItem.selectedColor === item.selectedColor
//     );

//     if (existingItemIndex >= 0) {
//       // Update quantity if item exists
//       const updatedCart = [...cart];
//       updatedCart[existingItemIndex].quantity += item.quantity;
//       setCart(updatedCart);

//       // Call API to update cart
//       AddToCart.mutate({
//         product_Id: item.id,
//         color: item.selectedColor || "",
//         model: item.name,
//         quantity: item.quantity,
//       });
//     } else {
//       // Add new item if it doesn't exist
//       setCart([...cart, item]);

//       // Call API to add to cart
//       AddToCart.mutate({
//         product_Id: item.id,
//         color: item.selectedColor || "",
//         model: item.name,
//         quantity: item.quantity,
//       });
//     }

//     // Update total
//     updateCartTotal([...cart, item]);
//   };

//   // Remove item from cart
//   const removeItem = (id: string, color?: string) => {
//     const filteredCart = cart.filter(
//       (item) => !(item.id === id && item.selectedColor === color)
//     );
//     setCart(filteredCart);

//     // Update total
//     updateCartTotal(filteredCart);

//     // TODO: Add API call to remove item from cart
//     // This would use the RemoveFromCart mutation once it's properly implemented
//     // For now, we'll just invalidate the query to refresh the cart data
//     queryClient.invalidateQueries({ queryKey: ["get_cart"] });
//   };

//   // Update item quantity
//   const updateQuantity = (id: string, quantity: number, color?: string) => {
//     const updatedCart = cart.map((item) => {
//       if (item.id === id && item.selectedColor === color) {
//         return { ...item, quantity };
//       }
//       return item;
//     });

//     setCart(updatedCart);

//     // Update total
//     updateCartTotal(updatedCart);

//     // TODO: Add API call to update item quantity
//     // This would use the UpdateCart mutation once it's properly implemented
//     // For now, we'll just invalidate the query to refresh the cart data
//     queryClient.invalidateQueries({ queryKey: ["get_cart"] });
//   };

//   // Calculate cart total
//   const updateCartTotal = (cartItems: CartItem[]) => {
//     const total = cartItems.reduce(
//       (sum, item) => sum + item.price * item.quantity,
//       0
//     );
//     setCartTotal(total);
//   };

//   // Clear cart
//   const clearCart = () => {
//     setCart([]);
//     setCartTotal(0);

//     // TODO: Add API call to clear cart
//     // This would use the ClearCart mutation once it's properly implemented
//     queryClient.invalidateQueries({ queryKey: ["get_cart"] });
//   };

//   return {
//     cart,
//     cartTotal,
//     isLoading,
//     addItem,
//     removeItem,
//     updateQuantity,
//     clearCart,
//   };
// };
