import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { ja } from "date-fns/locale";
export const cn = (...x: ClassValue[]) => twMerge(clsx(x));
export const formatDate = (v: string | null) =>
  v ? format(parseISO(v), "yyyy年M月d日", { locale: ja }) : "未設定";
export const today = "2026-07-22";
