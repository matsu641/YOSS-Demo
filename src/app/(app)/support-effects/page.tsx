"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle, ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays,
  CheckCircle2, ChevronDown, ClipboardCheck, Clock3, FileText, Info,
  Minus, Sparkles, TrendingUp, Users,
} from "lucide-react";

const scoreTrend = [24.8, 22.6, 20.9];
const actionRows = [
  { label: "実行済み", value: 28, total: 42, color: "#3f8a6b" },
  { label: "実施予定", value: 9, total: 42, color: "#5576c7" },
  { label: "期限超過", value: 5, total: 42, color: "#d26b55" },
];
const attentionRows = [
  { grade: "2年", className: "1組", student: "＊＊＊＊", score: "+6", absence: "+8日", action: "未実行 2件", updated: "7月18日" },
  { grade: "4年", className: "2組", student: "＊＊＊＊", score: "+5", absence: "+5日", action: "期限超過 1件", updated: "7月16日" },
  { grade: "6年", className: "1組", student: "＊＊＊＊", score: "+4", absence: "+7日", action: "未実行 1件", updated: "7月12日" },
  { grade: "3年", className: "3組", student: "＊＊＊＊", score: "+3", absence: "±0日", action: "記録なし", updated: "7月10日" },
];

function PanelTitle({ icon: Icon, title, note }: { icon: typeof TrendingUp; title: string; note?: string }) {
  return <div className="effects-panel-heading"><span className="effects-panel-icon"><Icon aria-hidden="true" /></span><div><h2>{title}</h2>{note && <p>{note}</p>}</div></div>;
}

function TrendChart({ values }: { values: number[] }) {
  const firstValue = values[0] ?? 0;
  const visibleValues = values.length === 1 ? [firstValue, firstValue, firstValue] : values;
  const points = visibleValues.map((value, index) => `${48 + index * (328 / (visibleValues.length - 1))},${155 - (value - 18) * 12}`).join(" ");
  return <div className="effects-trend-wrap">
    <svg className="effects-trend-chart" viewBox="0 0 430 190" role="img" aria-label="平均スクリーニング点数は1学期24.8点、2学期22.6点、3学期20.9点">
      {[38, 88, 138].map((y) => <line key={y} x1="40" y1={y} x2="400" y2={y} stroke="#e7ebf1" />)}
      <defs><linearGradient id="scoreArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5275c7" stopOpacity=".22" /><stop offset="1" stopColor="#5275c7" stopOpacity="0" /></linearGradient></defs>
      <polygon points={`${points} 376,158 48,158`} fill="url(#scoreArea)" />
      <polyline points={points} fill="none" stroke="#5275c7" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {visibleValues.map((value, index) => { const x = 48 + index * (328 / (visibleValues.length - 1)), y = 155 - (value - 18) * 12; return <g key={`${value}-${index}`}><circle cx={x} cy={y} r="6" fill="#fff" stroke="#5275c7" strokeWidth="4" /><text x={x} y={y - 17} textAnchor="middle">{value}</text><text x={x} y="180" textAnchor="middle">{index + 1}学期</text></g>; })}
    </svg>
    <div className="effects-chart-summary"><ArrowDownRight /><div><b>-3.9点</b><span>1学期からの変化</span></div></div>
  </div>;
}

export default function SupportEffectsPage() {
  const router = useRouter();
  const [year, setYear] = useState("2026");
  const [term, setTerm] = useState("all");
  const [grade, setGrade] = useState("");
  const [className, setClassName] = useState("");
  const filteredAttentionRows = useMemo(() => attentionRows.filter((row) =>
    (!grade || row.grade === `${grade}年`) && (!className || row.className === `${className}組`)
  ), [grade, className]);
  const scopeFactor = (grade ? 0.34 : 1) * (className ? 0.42 : 1) * (term === "all" ? 1 : 0.76) * (year === "2026" ? 1 : year === "2025" ? 0.91 : 0.84);
  const scoped = (value: number, minimum = 1) => Math.max(minimum, Math.round(value * scopeFactor));
  const trendValues = term === "all" ? scoreTrend.map((value) => +(value + (2026 - Number(year)) * .35).toFixed(1)) : [+((scoreTrend[Number(term) - 1] ?? scoreTrend[0] ?? 0) + (2026 - Number(year)) * .35).toFixed(1)];
  const studentListUrl = `/students?${new URLSearchParams({ year, ...(grade && { grade }), ...(className && { class: className }), actionStatus: "overdue" }).toString()}`;
  return <div className="support-effects-page">
    <header className="effects-heading">
      <div><span className="effects-eyebrow"><Sparkles /> SUPPORT MONITORING</span><h1>支援状況・変化ダッシュボード</h1><p>スクリーニングと支援記録から、児童生徒の状態変化と対応状況を確認します。</p></div>
      <div className="effects-data-note"><Info /><span><b>表示について</b>点数の変化は支援による効果や因果関係を示すものではありません。</span></div>
    </header>

    <section className="effects-filters" aria-label="表示条件">
      <div className="effects-filter-title"><CalendarDays /><span>表示条件</span></div>
      <label className="effects-filter-button"><span className="sr-only">年度</span><select value={year} onChange={(event) => setYear(event.target.value)}>{[2024, 2025, 2026].map((value) => <option key={value} value={value}>{value}年度</option>)}</select><ChevronDown /></label>
      <label className="effects-filter-button"><span className="sr-only">学期</span><select value={term} onChange={(event) => setTerm(event.target.value)}><option value="all">1〜3学期</option><option value="1">1学期</option><option value="2">2学期</option><option value="3">3学期</option></select><ChevronDown /></label>
      <label className="effects-filter-button"><span className="sr-only">学年</span><select value={grade} onChange={(event) => setGrade(event.target.value)}><option value="">全学年</option>{[1, 2, 3, 4, 5, 6].map((value) => <option key={value} value={value}>{value}年</option>)}</select><ChevronDown /></label>
      <label className="effects-filter-button"><span className="sr-only">クラス</span><select value={className} onChange={(event) => setClassName(event.target.value)}><option value="">全クラス</option>{[1, 2, 3].map((value) => <option key={value} value={value}>{value}組</option>)}</select><ChevronDown /></label>
      <span className="effects-updated">最終更新 7月22日 09:00</span>
    </section>

    <section className="effects-kpis" aria-label="主要指標">
      <article className="effects-kpi effects-blue"><span className="effects-kpi-icon"><ClipboardCheck /></span><div><span>解析済み</span><strong>{scoped(32)}<small>名</small></strong><b>対象 {scoped(36)}名中</b></div></article>
      <article className="effects-kpi effects-green"><span className="effects-kpi-icon"><ArrowDownRight /></span><div><span>前回より点数低下</span><strong>{scoped(18)}<small>名</small></strong><b>56.3%</b></div></article>
      <article className="effects-kpi effects-red"><span className="effects-kpi-icon"><ArrowUpRight /></span><div><span>前回より点数上昇</span><strong>{scoped(7)}<small>名</small></strong><b>21.9%</b></div></article>
      <article className="effects-kpi effects-slate"><span className="effects-kpi-icon"><Minus /></span><div><span>前回から横ばい</span><strong>{scoped(7)}<small>名</small></strong><b>21.9%</b></div></article>
      <article className="effects-kpi effects-amber"><span className="effects-kpi-icon"><Clock3 /></span><div><span>期限超過アクション</span><strong>{scoped(5)}<small>件</small></strong><b>{scoped(4)}名が対象</b></div></article>
    </section>

    <section className="effects-overview-grid">
      <article className="effects-panel effects-score-panel"><PanelTitle icon={TrendingUp} title="平均スクリーニング点数の推移" note="解析済みの児童生徒を学期ごとに集計" /><TrendChart values={trendValues} /></article>
      <article className="effects-panel effects-actions-panel">
        <PanelTitle icon={CheckCircle2} title="アクション実施状況" note="削除済みの記録を除く全42件" />
        <div className="effects-donut-row"><div className="effects-donut"><div><strong>67%</strong><span>実行済み</span></div></div><div className="effects-action-bars">
          {actionRows.map((row) => <div key={row.label}><div><span><i style={{ background: row.color }} />{row.label}</span><b>{row.value}件</b></div><progress value={row.value} max={row.total} style={{ accentColor: row.color }} /></div>)}
        </div></div>
        <div className="effects-mini-stats"><span><b>8.4日</b>予定から実行までの平均</span><span><b>4名</b>期限超過の対象者</span></div>
      </article>
    </section>

    <section className="effects-detail-grid">
      <article className="effects-panel"><PanelTitle icon={FileText} title="対応記録の推移" note="対応日を基準に月別集計" /><div className="effects-record-summary"><strong>72<small>件</small></strong><span>直近3か月の対応記録<br /><b>前期間比 +11件</b></span></div><div className="effects-month-bars">{[{ m: "5月", v: 18 }, { m: "6月", v: 23 }, { m: "7月", v: 31 }].map(({ m, v }) => <div key={m}><span>{v}</span><i style={{ height: `${v * 2.4}px` }} /><b>{m}</b></div>)}</div></article>
      <article className="effects-panel"><PanelTitle icon={Users} title="欠席日数の変化" note="前学年の欠席日数と比較できる28名" /><div className="effects-absence-list">
        <div><span className="is-danger"><ArrowUpRight /></span><p><b>増加</b><small>前学年より3日以上増加</small></p><strong>6名</strong></div>
        <div><span className="is-neutral"><Minus /></span><p><b>横ばい</b><small>変化が±2日以内</small></p><strong>9名</strong></div>
        <div><span className="is-good"><ArrowDownRight /></span><p><b>減少</b><small>前学年より3日以上減少</small></p><strong>13名</strong></div>
      </div></article>
      <article className="effects-panel"><PanelTitle icon={Sparkles} title="A / B / C 判定分布" note="最新スクリーニングのAI判定を集計" /><div className="effects-directions">
        <div className="effects-direction-a"><span>A</span><p><b>教職員の関与</b><small>判定あり</small></p><strong>21名</strong></div>
        <div className="effects-direction-b"><span>B</span><p><b>地域資源の活用</b><small>判定あり</small></p><strong>12名</strong></div>
        <div className="effects-direction-c"><span>C</span><p><b>専門機関の活用</b><small>判定あり</small></p><strong>8名</strong></div>
      </div><p className="effects-direction-note"><Info />複数判定を含みます。実際の支援実施件数ではありません。</p></article>
    </section>

    <section className="effects-panel effects-attention">
      <div className="effects-attention-header"><PanelTitle icon={AlertCircle} title="確認が必要な児童生徒" note="点数・欠席日数・アクション状況を組み合わせて確認" /><button type="button" onClick={() => router.push(studentListUrl)}>生徒一覧で確認 <ArrowRight /></button></div>
      <div className="effects-table-wrap"><table><thead><tr><th>学年</th><th>クラス</th><th>児童生徒</th><th>点数変化</th><th>欠席日数変化</th><th>アクション状況</th><th>最終更新</th><th /></tr></thead><tbody>
        {filteredAttentionRows.map((row, index) => <tr key={`${row.grade}-${row.className}`}><td>{row.grade}</td><td>{row.className}</td><td><span className="effects-student-avatar">{index + 1}</span>{row.student}</td><td><b className="effects-badge is-score-up">{row.score}点</b></td><td>{row.absence}</td><td><b className={`effects-badge ${row.action === "記録なし" ? "is-muted" : "is-action-alert"}`}>{row.action}</b></td><td>{row.updated}</td><td><button type="button" aria-label="詳細を見る" onClick={() => router.push(`/students/student-${index + 1}`)}><ArrowRight /></button></td></tr>)}
        {filteredAttentionRows.length === 0 && <tr><td colSpan={8} className="effects-empty-row">選択した条件に該当する児童生徒はいません。</td></tr>}
      </tbody></table></div>
      <p className="effects-table-caption"><Info />この一覧は状態の変化と未完了記録を示すもので、支援との因果関係を判定するものではありません。</p>
    </section>
  </div>;
}
