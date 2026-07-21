"use client";
import {
  useEffect,
  useId,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { AlertCircle, CheckCircle2, Clock3, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { directionConfig, statusConfig } from "@/config";
import type { ActionStatus, SupportDirection } from "@/types";
import { useUiStore } from "@/stores";
export function Button({
  className,
  variant = "primary",
  ...p
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "danger";
}) {
  return (
    <button className={cn("button", `button-${variant}`, className)} {...p} />
  );
}
export function Input({
  label,
  error,
  ...p
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const id = useId();
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <input id={id} className="input" {...p} />
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
export function Textarea({
  label,
  error,
  ...p
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
}) {
  const id = useId();
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <textarea id={id} className="input textarea" {...p} />
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
export function Select({
  label,
  children,
  ...p
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <select id={id} className="input" {...p}>
        {children}
      </select>
    </label>
  );
}
export function Card({
  children,
  className,
  ...p
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("card", className)} {...p}>
      {children}
    </div>
  );
}
export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={cn("badge", className)}>{children}</span>;
}
export function DirectionBadge({ direction }: { direction: SupportDirection }) {
  const c = directionConfig[direction];
  return <Badge className={c.className}>{c.label}</Badge>;
}
export function StatusBadge({
  status,
  overdue = false,
}: {
  status: ActionStatus;
  overdue?: boolean;
}) {
  if (overdue)
    return (
      <Badge className="status-danger">
        <AlertCircle size={14} />
        期限超過
      </Badge>
    );
  const c = statusConfig[status];
  return (
    <Badge className={c.className}>
      {status === "completed" ? (
        <CheckCircle2 size={14} />
      ) : (
        <Clock3 size={14} />
      )}{" "}
      {c.label}
    </Badge>
  );
}
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}
export function EmptyState({ action }: { action?: ReactNode }) {
  return (
    <Card className="empty-state">
      <AlertCircle />
      <h3>該当するデータが見つかりませんでした。</h3>
      <p>検索条件を変更するか、条件をすべて解除してください。</p>
      {action}
    </Card>
  );
}
export function Tabs({
  items,
  active,
  onChange,
}: {
  items: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="tabs" role="tablist">
      {items.map((i) => (
        <button
          key={i.id}
          role="tab"
          aria-selected={i.id === active}
          onClick={() => onChange(i.id)}
        >
          {i.label}
        </button>
      ))}
    </div>
  );
}
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", f);
    return () => document.removeEventListener("keydown", f);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div role="dialog" aria-modal="true" className="modal">
        <div className="modal-head">
          <h2>{title}</h2>
          <button aria-label="閉じる" onClick={onClose}>
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export function Drawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("drawer-overlay", open && "open")}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside className="drawer">
        <div className="modal-head">
          <h2>{title}</h2>
          <button aria-label="閉じる" onClick={onClose}>
            <X />
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}
export function ToastViewport() {
  const ts = useUiStore((s) => s.toasts),
    dismiss = useUiStore((s) => s.dismiss);
  return (
    <div className="toasts" aria-live="polite">
      {ts.map((t) => (
        <div className="toast" key={t.id}>
          <CheckCircle2 />
          <span>{t.message}</span>
          <button aria-label="閉じる" onClick={() => dismiss(t.id)}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
