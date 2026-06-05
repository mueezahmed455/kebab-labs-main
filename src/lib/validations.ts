import { z } from "zod";

export const OrderItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
});

export const CreateOrderSchema = z.object({
  items: z.array(OrderItemSchema).min(1, "Order must contain at least one item"),
  totalAmount: z.number().positive(),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  deliveryAddress: z.string().min(10, "Please provide a complete delivery address").optional(),
  orderType: z.enum(["delivery", "collection"]),
});

export const ProfileUpdateSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  dietaryPreferences: z.array(z.string()).optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
