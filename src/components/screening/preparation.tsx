"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react";
import { Button, Card, Input, Select, Tabs, Textarea } from "@/components/ui";
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
  Student,
} from "@/types";
const categories = Object.entries(categoryLabels).map(([id, label]) => ({
  id,
  label,
}));
export function Preparation({
  students,
  definitions,
}: {
  students: Student[];
  definitions: ScreeningItemDefinition[];
}) {
  const params = useSearchParams(),
    router = useRouter(),
    initial = params.get("student") ?? students[0]?.id ?? "";
  const [id, setId] = useState(initial),
    [cat, setCat] = useState<ScreeningCategory>("school-life"),
    [saved, setSaved] = useState(true);
  const sessions = useScreeningStore((s) => s.sessions),
    save = useScreeningStore((s) => s.saveResponse),
    saveConcern = useScreeningStore((s) => s.saveConcern);
  const student = students.find((s) => s.id === id) ?? students[0],
    session = sessions.find((s) => s.studentId === student?.id),
    index = students.findIndex((s) => s.id === student?.id);
  useEffect(() => {
    if (!saved) {
      const t = setTimeout(() => setSaved(true), 500);
      return () => clearTimeout(t);
    }
  }, [saved]);
  if (!student) return null;
  const move = (n: number) => {
    const next = students[index + n];
    if (next) {
      setId(next.id);
      router.replace(`/screening/prepare?student=${next.id}`);
    }
  };
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
  return (
    <>
      <Card className="sticky-form-head">
        <div className="direction-head">
          <div>
            <b>スクリーニング会議準備</b>
            <small className="muted">　2026年度・1学期</small>
          </div>
          <span
            className={saved ? "badge status-success" : "badge status-info"}
          >
            {saved ? (
              <>
                <Check size={14} />
                保存済み
              </>
            ) : (
              <>
                <Save size={14} />
                保存中...
              </>
            )}
          </span>
        </div>
        <div className="student-nav">
          <Button
            variant="outline"
            disabled={index === 0}
            onClick={() => move(-1)}
          >
            <ArrowLeft />
            前へ
          </Button>
          <Select
            label="対象生徒"
            value={student.id}
            onChange={(e) => {
              setId(e.target.value);
              router.replace(`/screening/prepare?student=${e.target.value}`);
            }}
          >
            {students.map((s) => (
              <option value={s.id} key={s.id}>
                {s.grade}年{s.className}組 {s.name}
              </option>
            ))}
          </Select>
          <Button
            variant="outline"
            disabled={index === students.length - 1}
            onClick={() => move(1)}
          >
            次へ
            <ArrowRight />
          </Button>
          <b>
            {index + 1} / {students.length}人
          </b>
        </div>
      </Card>
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
                  <div className="form-grid section">
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
                        {Object.entries(verificationLabels).map(([v, l]) => (
                          <option value={v} key={v}>
                            {l}
                          </option>
                        ))}
                      </Select>
                      <Input
                        label="補足"
                        value={r?.note ?? ""}
                        onChange={(e) => change(item, { note: e.target.value })}
                      />
                    </div>
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
