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
  const [students, actions, records, staff, screenings] = await Promise.all([
    repositories.students.getAll(),
    repositories.actions.getAll(),
    repositories.records.getAll(),
    repositories.reference.getStaff(),
    repositories.reference.getScreenings(),
  ]);
  const targetStudentCount = (targetActions: typeof actions) =>
    new Set(targetActions.map((action) => action.studentId)).size;
  const stats = [
    {
      label: "期限超過",
      href: "/actions?status=overdue",
      count: targetStudentCount(actions.filter(isOverdue)),
      icon: AlertCircle,
    },
    {
      label: "期限間近",
      href: "/actions?due=soon",
      count: targetStudentCount(
        actions.filter(
          (a) => !!a.dueDate && a.dueDate >= today && a.dueDate <= "2026-07-29",
        ),
      ),
      icon: Clock3,
    },
    {
      label: "対応中",
      href: "/actions?status=in-progress",
      count: targetStudentCount(
        actions.filter((a) => a.status === "in-progress"),
      ),
      icon: CheckCircle2,
    },
    {
      label: "要再確認",
      href: "/actions?status=needs-review",
      count: targetStudentCount(
        actions.filter((a) => a.status === "needs-review"),
      ),
      icon: RefreshCw,
    },
  ];
  const ds: SupportDirection[] = ["A", "B", "C"];
  const recentScreenings = [...screenings]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 8);
  const screeningRow = (screening: (typeof screenings)[number]) => {
    const student = students.find((item) => item.id === screening.studentId);
    const evaluator = staff.find(
      (member) => member.id === screening.evaluatorId,
    );
    return (
      <div className="list-row dashboard-evaluation-row" key={screening.id}>
        <span className="avatar">{evaluator?.avatarInitials ?? "?"}</span>
        <div>
          <Link href={`/students/${screening.studentId}`}>
            <b>{student?.name}</b>
          </Link>
          <small>
            {evaluator?.name ?? "担当者不明"}・{screening.totalScore}点
          </small>
          {screening.sharedConcernNote && (
            <small>{screening.sharedConcernNote}</small>
          )}
        </div>
        <small>{formatDate(screening.updatedAt)}</small>
      </div>
    );
  };
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
                  <small>人</small>
                </strong>
                <small>対象生徒数</small>
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
      <div className="dashboard-bottom-grid section">
        <section>
          <div className="section-head">
            <h2>教職員のスクリーニング評価</h2>
            <span className="muted">最近更新された評価</span>
          </div>
          <Card className="dashboard-evaluation-card">
            {recentScreenings.slice(0, 3).map(screeningRow)}
            {recentScreenings.length > 3 && (
              <details className="dashboard-evaluation-details">
                <summary className="button button-outline">
                  <span className="dashboard-evaluation-open-label">
                    詳細を見る
                  </span>
                  <span className="dashboard-evaluation-close-label">
                    閉じる
                  </span>
                </summary>
                {recentScreenings.slice(3).map(screeningRow)}
              </details>
            )}
          </Card>
        </section>
        <section>
          <h2>会議を進める</h2>
          <div className="grid dashboard-meeting-links">
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
      </div>
    </>
  );
}
