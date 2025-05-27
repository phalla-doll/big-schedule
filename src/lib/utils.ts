import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { User } from "@/lib/global-interface";


export const defaultUser: User = {
  id: crypto.randomUUID(),
  name: "Temporary User",
  email: "temporary@user.com",
  role: "user",
  createdAt: new Date().toISOString(),
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
