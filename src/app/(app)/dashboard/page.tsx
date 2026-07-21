import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Users,
} from "lucide-react";
import { Card, DirectionBadge, PageHeader } from "@/components/ui";
import { repositories, isOverdue } from "@/repositories";
import { formatDate, today } from "@/lib/utils";
import type { SupportDirection } from "@/types";
export default async function Page() {
  const [students, actions, records, staff] = await Promise.all([
    repositories.students.getAll(),
    repositories.actions.getAll(),
    repositories.records.getAll(),
    repositories.reference.getStaff(),
  ]);
  const stats = [
    {
      label: "期限超過",
      href: "/actions?status=overdue",
      count: actions.filter(isOverdue).length,
      icon: AlertCircle,
    },
    {
      label: "期限間近",
      href: "/actions?due=soon",
      count: actions.filter(
        (a) => !!a.dueDate && a.dueDate >= today && a.dueDate <= "2026-07-29",
      ).length,
      icon: Clock3,
    },
    {
      label: "対応中",
      href: "/actions?status=in-progress",
      count: actions.filter((a) => a.status === "in-progress").length,
      icon: CheckCircle2,
    },
    {
      label: "要再確認",
      href: "/actions?status=needs-review",
      count: actions.filter((a) => a.status === "needs-review").length,
      icon: RefreshCw,
    },
  ];
  const ds: SupportDirection[] = ["A", "B", "C"];
  return (
    <>
      <PageHeader
        title="ダッシュボード"
        description="学校全体の状況と、次に確認・対応すべきことをまとめています。"
        actions={
          <span className="badge status-neutral">
            デモデータ・2026年7月22日時点
          </span>
        }
      />
      <section>
        <div className="section-head">
          <h2>要対応アクション</h2>
          <Link href="/actions">すべて見る</Link>
        </div>
        <div className="grid grid-4">
          {stats.map(({ label, href, count, icon: Icon }) => (
            <Link className="stat-card" href={href} key={label}>
              <Icon />
              <div>
                <span>{label}</span>
                <strong>
                  {count}
                  <small>件</small>
                </strong>
                <small>対象を確認してください</small>
              </div>
              <ArrowRight />
            </Link>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <h2>支援方向サマリー</h2>
          <span className="muted">学年別人数</span>
        </div>
        <div className="grid grid-3">
          {ds.map((d) => {
            const list = students.filter((s) =>
              s.supportDirections.includes(d),
            );
            return (
              <Card key={d}>
                <Link
                  href={`/students?direction=${d}`}
                  className="direction-head"
                >
                  <DirectionBadge direction={d} />
                  <b>合計 {list.length}名</b>
                </Link>
                <div className="grade-counts">
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <Link key={g} href={`/students?direction=${d}&grade=${g}`}>
                      <span>{g}年</span>
                      <b>{list.filter((s) => s.grade === g).length}名</b>
                    </Link>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </section>
      <div className="grid grid-2 section">
        <section>
          <div className="section-head">
            <h2>要確認の生徒</h2>
            <Link href="/students?preset=review">一覧へ</Link>
          </div>
          <Card>
            {students
              .filter((s) => !!s.nextReviewDate && s.nextReviewDate < today)
              .slice(0, 5)
              .map((s) => (
                <div className="list-row" key={s.id}>
                  <span className="avatar">{s.name[0]}</span>
                  <div>
                    <Link href={`/students/${s.id}`}>
                      <b>{s.name}</b>
                    </Link>
                    <small>
                      {s.grade}年{s.className}組・次回確認日{" "}
                      {formatDate(s.nextReviewDate)}
                    </small>
                  </div>
                  {s.supportDirections.map((d) => (
                    <DirectionBadge key={d} direction={d} />
                  ))}
                </div>
              ))}
          </Card>
        </section>
        <section>
          <div className="section-head">
            <h2>最近の対応記録</h2>
            <Link href="/students">生徒一覧へ</Link>
          </div>
          <Card>
            {records.slice(0, 5).map((r) => {
              const s = students.find((x) => x.id === r.studentId);
              return (
                <div className="list-row" key={r.id}>
                  <small>{formatDate(r.occurredAt)}</small>
                  <div>
                    <Link href={`/students/${r.studentId}`}>
                      <b>{s?.name}</b>
                    </Link>
                    <small>{r.content.slice(0, 32)}…</small>
                  </div>
                  <small>{staff.find((x) => x.id === r.createdBy)?.name}</small>
                </div>
              );
            })}
          </Card>
        </section>
      </div>
      <section className="section">
        <h2>会議を進める</h2>
        <div className="grid grid-3">
          {[
            {
              h: "/screening/prepare",
              t: "スクリーニング会議を準備する",
              d: "事前情報を入力",
              I: Users,
            },
            {
              h: "/screening/meeting",
              t: "スクリーニング会議を実施する",
              d: "判定とメモを記録",
              I: CalendarCheck,
            },
            {
              h: "/team-meeting",
              t: "校内チーム会議を実施する",
              d: "支援内容を決定",
              I: CheckCircle2,
            },
          ].map(({ h, t, d, I }) => (
            <Link href={h} className="meeting-link" key={h}>
              <I />
              <div>
                <b>{t}</b>
                <span>{d}</span>
              </div>
              <ArrowRight />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
