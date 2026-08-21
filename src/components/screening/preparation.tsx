"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronUp, Plus } from "lucide-react";
import { Button, Card, Input, Select, Tabs, Textarea } from "@/components/ui";
import { MeetingSearchFilters } from "@/components/meetings/meeting-search-filters";
import {
  SCREENING_SCORE_OPTIONS,
  categoryLabels,
  sourceLabels,
  verificationLabels,
} from "@/config";
import { useScreeningStore } from "@/stores";
import type {
  ScreeningCategory,
  ScreeningItemDefinition,
  ScreeningResponse,
  Staff,
  Student,
} from "@/types";
const categories = Object.entries(categoryLabels).map(([id, label]) => ({
  id,
  label,
}));
export function Preparation({
  students,
  staff,
  definitions,
}: {
  students: Student[];
  staff: Staff[];
  definitions: ScreeningItemDefinition[];
}) {
  const params = useSearchParams(),
    router = useRouter(),
    initial = params.get("student") ?? students[0]?.id ?? "";
  const [id, setId] = useState(initial),
    [cat, setCat] = useState<ScreeningCategory>("school-adaptation"),
    [saved, setSaved] = useState(true),
    [openMemos, setOpenMemos] = useState<Set<string>>(new Set());
  const sessions = useScreeningStore((s) => s.sessions),
    save = useScreeningStore((s) => s.saveResponse),
    saveConcern = useScreeningStore((s) => s.saveConcern);
  const student = students.find((s) => s.id === id) ?? students[0],
    session = sessions.find((s) => s.studentId === student?.id);
  useEffect(() => {
    if (!saved) {
      const t = setTimeout(() => setSaved(true), 500);
      return () => clearTimeout(t);
    }
  }, [saved]);
  if (!student) return null;
  const change = (
    item: ScreeningItemDefinition,
    patch: Partial<ScreeningResponse>,
  ) => {
    const old = session?.responses.find((r) => r.itemId === item.id) ?? {
      itemId: item.id,
      score: null,
      observedFact: "",
      informationSource: null,
      verificationStatus: null,
      note: "",
    };
    setSaved(false);
    save(student.id, { ...old, ...patch });
  };
  const toggleMemo = (itemId: string) => {
    setOpenMemos((current) => {
      const next = new Set(current);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };
  return (
    <>
      <div className="sticky-form-head">
        <MeetingSearchFilters
          students={students}
          staff={staff}
          selectedId={student.id}
          onStudentChange={(studentId) => {
            setId(studentId);
            router.replace(`/screening/prepare?student=${studentId}`);
          }}
        />
      </div>
      <div className="section">
        <Tabs
          items={categories}
          active={cat}
          onChange={(v) => setCat(v as ScreeningCategory)}
        />
        <div className="grid">
          {definitions
            .filter((d) => d.category === cat)
            .map((item) => {
              const r = session?.responses.find((x) => x.itemId === item.id);
              const isMemoOpen = openMemos.has(item.id);
              const hasMemo = Boolean(
                r?.observedFact ||
                r?.informationSource ||
                r?.verificationStatus ||
                r?.note,
              );
              return (
                <Card key={item.id}>
                  <h2>{item.label}</h2>
                  <p className="muted">{item.description}</p>
                  <fieldset className="score-selector">
                    <legend>スコア</legend>
                    {SCREENING_SCORE_OPTIONS.map((n) => (
                      <label key={n}>
                        <input
                          type="radio"
                          name={item.id}
                          checked={r?.score === n}
                          onChange={() => change(item, { score: n })}
                        />
                        <span>{n}</span>
                      </label>
                    ))}
                  </fieldset>
                  <div className="section">
                    <div className="screening-memo-actions">
                      <Button
                        className="screening-memo-button"
                        variant="outline"
                        onClick={() => toggleMemo(item.id)}
                        aria-expanded={isMemoOpen}
                        aria-controls={`memo-${item.id}`}
                      >
                        {isMemoOpen ? <ChevronUp /> : <Plus />}
                        {isMemoOpen
                          ? "メモ入力を閉じる"
                          : hasMemo
                            ? "入力済みメモを確認・編集"
                            : "メモを追加する"}
                      </Button>
                      {hasMemo && !isMemoOpen && (
                        <small className="muted">
                          入力済みのメモがあります
                        </small>
                      )}
                    </div>
                    {isMemoOpen && (
                      <div className="form-grid section" id={`memo-${item.id}`}>
                        <Textarea
                          label="観察された事実"
                          placeholder="例：今週、昼食を持参していない日が3日あった"
                          value={r?.observedFact ?? ""}
                          onChange={(e) =>
                            change(item, { observedFact: e.target.value })
                          }
                        />
                        <div className="grid">
                          <Select
                            label="情報源"
                            value={r?.informationSource ?? ""}
                            onChange={(e) =>
                              change(item, {
                                informationSource: e.target
                                  .value as ScreeningResponse["informationSource"],
                              })
                            }
                          >
                            <option value="">選択してください</option>
                            {Object.entries(sourceLabels).map(([v, l]) => (
                              <option value={v} key={v}>
                                {l}
                              </option>
                            ))}
                          </Select>
                          <Select
                            label="確認状態"
                            value={r?.verificationStatus ?? ""}
                            onChange={(e) =>
                              change(item, {
                                verificationStatus: e.target
                                  .value as ScreeningResponse["verificationStatus"],
                              })
                            }
                          >
                            <option value="">選択してください</option>
                            {Object.entries(verificationLabels).map(
                              ([v, l]) => (
                                <option value={v} key={v}>
                                  {l}
                                </option>
                              ),
                            )}
                          </Select>
                          <Input
                            label="補足"
                            value={r?.note ?? ""}
                            onChange={(e) =>
                              change(item, { note: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          {cat === "family" && (
            <Card>
              <h2>会議で共有する気になる情報</h2>
              <p className="notice">
                この内容は会議で共有されます。観察した事実と推測を分けて記載してください。
              </p>
              <Textarea
                label="自由記述"
                value={session?.sharedConcernNote ?? ""}
                onChange={(e) => {
                  setSaved(false);
                  saveConcern(student.id, e.target.value);
                }}
              />
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
