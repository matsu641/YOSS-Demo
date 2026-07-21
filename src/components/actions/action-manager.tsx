"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import {
  Button,
  DirectionBadge,
  Drawer,
  Input,
  Modal,
  Select,
  StatusBadge,
  Textarea,
} from "@/components/ui";
import { formatDate, today } from "@/lib/utils";
import { priorityLabels, statusConfig } from "@/config";
import { useActionStore, useUiStore } from "@/stores";
import type {
  ActionStatus,
  Staff,
  Student,
  SupportAction,
} from "@/types";
const schema = z.object({
  studentId: z.string().min(1, "対象生徒を選択してください"),
  title: z.string().min(1, "内容を入力してください"),
  assigneeId: z.string().min(1, "担当者を選択してください"),
  dueDate: z.string().min(1, "期限を入力してください"),
  direction: z.enum(["A", "B", "C"]),
  priority: z.enum(["high", "medium", "low"]),
});
type Form = z.infer<typeof schema>;
export function ActionManager({
  students,
  staff,
}: {
  students: Student[];
  staff: Staff[];
}) {
  const params = useSearchParams(),
    status = params.get("status") ?? "";
  const actions = useActionStore((s) => s.actions),
    add = useActionStore((s) => s.addAction),
    update = useActionStore((s) => s.updateAction),
    toast = useUiStore((s) => s.toast);
  const [create, setCreate] = useState(false),
    [selected, setSelected] = useState<SupportAction | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      studentId: "",
      title: "",
      assigneeId: "",
      dueDate: "",
      direction: "A",
      priority: "medium",
    },
  });
  const filtered = useMemo(
    () =>
      actions.filter(
        (a) =>
          !status ||
          (status === "overdue"
            ? !!a.dueDate && a.dueDate < today && a.status !== "completed"
            : a.status === status),
      ),
    [actions, status],
  );
  const submit = (v: Form) => {
    const now = new Date().toISOString();
    add({
      id: `action-${Date.now()}`,
      ...v,
      description: "",
      status: "not-started",
      startDate: null,
      nextReviewDate: null,
      completedAt: null,
      resultNote: "",
      sourceMeetingId: null,
      createdAt: now,
      updatedAt: now,
    });
    reset();
    setCreate(false);
    toast("アクションを仮保存しました");
  };
  return (
    <>
      <div className="card toolbar">
        <Select
          label="ステータス"
          defaultValue={status}
          onChange={(e) =>
            location.assign(
              `/actions${e.target.value ? `?status=${e.target.value}` : ""}`,
            )
          }
        >
          <option value="">すべて</option>
          {Object.entries(statusConfig).map(([v, c]) => (
            <option key={v} value={v}>
              {c.label}
            </option>
          ))}
          <option value="overdue">期限超過</option>
        </Select>
        <Select label="優先度">
          <option>すべて</option>
          <option>高</option>
          <option>中</option>
          <option>低</option>
        </Select>
        <Select label="担当者">
          <option>すべて</option>
          {staff.map((s) => (
            <option key={s.id}>{s.name}</option>
          ))}
        </Select>
        <Input label="生徒名" placeholder="氏名で検索" />
        <Button onClick={() => setCreate(true)}>
          <Plus />
          アクションを追加
        </Button>
      </div>
      <p className="muted section">{filtered.length}件を表示</p>
      <div className="table-wrap">
        <table className="desktop-table">
          <thead>
            <tr>
              <th>優先度</th>
              <th>対象生徒</th>
              <th>方向</th>
              <th>アクション内容</th>
              <th>担当者</th>
              <th>期限</th>
              <th>ステータス</th>
              <th>次回確認日</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const overdue =
                !!a.dueDate && a.dueDate < today && a.status !== "completed";
              return (
                <tr key={a.id}>
                  <td>
                    <b>{priorityLabels[a.priority]}</b>
                  </td>
                  <td>{students.find((s) => s.id === a.studentId)?.name}</td>
                  <td>
                    <DirectionBadge direction={a.direction} />
                  </td>
                  <td>
                    <b>{a.title}</b>
                    {a.status === "completed" && !a.resultNote && (
                      <small className="field-error">
                        　結果メモを入力してください
                      </small>
                    )}
                  </td>
                  <td>
                    {staff.find((s) => s.id === a.assigneeId)?.name ?? "未設定"}
                  </td>
                  <td className={overdue ? "field-error" : ""}>
                    {formatDate(a.dueDate)}
                  </td>
                  <td>
                    <StatusBadge status={a.status} overdue={overdue} />
                  </td>
                  <td>{formatDate(a.nextReviewDate)}</td>
                  <td>
                    <Button variant="ghost" onClick={() => setSelected(a)}>
                      詳細・編集
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Modal
        open={create}
        onClose={() => setCreate(false)}
        title="アクションを追加"
      >
        <form onSubmit={handleSubmit(submit)}>
          <div className="form-grid">
            <label className="field">
              <span>対象生徒</span>
              <select className="input" {...register("studentId")}>
                <option value="">選択してください</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.studentId && (
                <small className="field-error">
                  {errors.studentId.message}
                </small>
              )}
            </label>
            <Input
              label="アクション内容"
              error={errors.title?.message}
              {...register("title")}
            />
            <label className="field">
              <span>担当者</span>
              <select className="input" {...register("assigneeId")}>
                <option value="">選択してください</option>
                {staff.map((s) => (
                  <option value={s.id} key={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.assigneeId && (
                <small className="field-error">
                  {errors.assigneeId.message}
                </small>
              )}
            </label>
            <Input
              type="date"
              label="期限"
              error={errors.dueDate?.message}
              {...register("dueDate")}
            />
            <label className="field">
              <span>支援方向</span>
              <select className="input" {...register("direction")}>
                <option value="A">A 教職員関与</option>
                <option value="B">B 地域資源</option>
                <option value="C">C 専門機関</option>
              </select>
            </label>
            <label className="field">
              <span>優先度</span>
              <select className="input" {...register("priority")}>
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </label>
          </div>
          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCreate(false)}
            >
              キャンセル
            </Button>
            <Button type="submit">仮保存する</Button>
          </div>
        </form>
      </Modal>
      <Drawer
        open={!!selected}
        onClose={() => setSelected(null)}
        title="アクション詳細・編集"
      >
        {selected && (
          <div className="grid">
            <p>
              <b>対象生徒：</b>
              {students.find((s) => s.id === selected.studentId)?.name}
            </p>
            <DirectionBadge direction={selected.direction} />
            <Textarea
              label="アクション内容"
              value={selected.title}
              onChange={(e) =>
                setSelected({ ...selected, title: e.target.value })
              }
            />
            <Select
              label="ステータス"
              value={selected.status}
              onChange={(e) =>
                setSelected({
                  ...selected,
                  status: e.target.value as ActionStatus,
                })
              }
            >
              {Object.entries(statusConfig).map(([v, c]) => (
                <option value={v} key={v}>
                  {c.label}
                </option>
              ))}
            </Select>
            <Textarea
              label="実施内容・結果メモ"
              value={selected.resultNote}
              onChange={(e) =>
                setSelected({ ...selected, resultNote: e.target.value })
              }
            />
            <Button
              onClick={() => {
                update(selected.id, selected);
                setSelected(null);
                toast("アクションを更新しました");
              }}
            >
              変更を仮保存
            </Button>
          </div>
        )}
      </Drawer>
    </>
  );
}
