"use client";
import { useState } from "react";
import { Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Button, Input, Modal, Textarea } from "@/components/ui";
import { useFlagStore, useStudentStore, useUiStore } from "@/stores";
import type { InternalFlag } from "@/types";
const blank: InternalFlag = {
  id: "",
  name: "",
  shortLabel: "",
  description: "",
  colorToken: "blue",
  isVisible: true,
};
export function FlagManager() {
  const flags = useFlagStore((s) => s.flags),
    save = useFlagStore((s) => s.saveFlag),
    del = useFlagStore((s) => s.deleteFlag),
    students = useStudentStore((s) => s.students),
    toast = useUiStore((s) => s.toast);
  const [editing, setEditing] = useState<InternalFlag | null>(null),
    [deleting, setDeleting] = useState<InternalFlag | null>(null);
  const persist = () => {
    if (!editing?.name) {
      toast("表示名を入力してください");
      return;
    }
    save({
      ...editing,
      id: editing.id || `flag-${Date.now()}`,
      shortLabel: editing.shortLabel || editing.name[0] || "?",
    });
    setEditing(null);
    toast("フラグを仮保存しました");
  };
  return (
    <>
      <Button onClick={() => setEditing(blank)}>
        <Plus />
        フラグを追加
      </Button>
      <div className="table-wrap section">
        <table className="desktop-table">
          <thead>
            <tr>
              <th>プレビュー</th>
              <th>表示名</th>
              <th>省略文字</th>
              <th>説明</th>
              <th>使用中</th>
              <th>表示状態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {flags.map((f) => (
              <tr key={f.id}>
                <td>
                  <span className={`flag-preview flag-${f.colorToken}`}>
                    {f.shortLabel}
                  </span>
                </td>
                <td>
                  <b>{f.name}</b>
                </td>
                <td>{f.shortLabel}</td>
                <td>{f.description}</td>
                <td>
                  {
                    students.filter((s) => s.internalFlagIds.includes(f.id))
                      .length
                  }
                  名
                </td>
                <td>
                  {f.isVisible ? (
                    <>
                      <Eye size={16} /> 表示
                    </>
                  ) : (
                    <>
                      <EyeOff size={16} /> 非表示
                    </>
                  )}
                </td>
                <td>
                  <Button variant="ghost" onClick={() => setEditing(f)}>
                    編集
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => save({ ...f, isVisible: !f.isVisible })}
                  >
                    {f.isVisible ? "非表示" : "表示"}
                  </Button>
                  <Button variant="ghost" onClick={() => setDeleting(f)}>
                    <Trash2 size={16} />
                    削除
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="校内対応フラグを編集"
      >
        {editing && (
          <div className="grid">
            <Input
              label="表示名"
              value={editing.name}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  name: e.target.value,
                  shortLabel: editing.shortLabel || e.target.value[0] || "",
                })
              }
            />
            <Input
              label="省略文字"
              maxLength={2}
              value={editing.shortLabel}
              onChange={(e) =>
                setEditing({ ...editing, shortLabel: e.target.value })
              }
            />
            <Textarea
              label="説明"
              value={editing.description}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
            />
            <Input
              label="色トークン"
              value={editing.colorToken}
              onChange={(e) =>
                setEditing({ ...editing, colorToken: e.target.value })
              }
            />
            <label>
              <input
                type="checkbox"
                checked={editing.isVisible}
                onChange={(e) =>
                  setEditing({ ...editing, isVisible: e.target.checked })
                }
              />{" "}
              一覧に表示する
            </label>
            <Button onClick={persist}>仮保存する</Button>
          </div>
        )}
      </Modal>
      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title="フラグを削除しますか？"
      >
        <p>「{deleting?.name}」を削除します。</p>
        <div className="form-actions">
          <Button variant="outline" onClick={() => setDeleting(null)}>
            キャンセル
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (deleting) del(deleting.id);
              setDeleting(null);
              toast("フラグを削除しました");
            }}
          >
            削除する
          </Button>
        </div>
      </Modal>
    </>
  );
}
