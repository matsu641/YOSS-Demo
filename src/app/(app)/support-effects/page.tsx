import {
  AlertTriangle,
  Bot,
  Download,
  HelpCircle,
  PieChart,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const months = ["4月", "5月", "6月", "7月", "8月", "9月"];
const scoreRows = [
  ["学校適応", 42.1, 36.3],
  ["学習", 48.6, 40.2],
  ["家庭状況", 45.3, 38.1],
  ["健康", 39.4, 33.2],
  ["経済", 37.2, 31.6],
  ["地域情報", 28.7, 24.1],
] as const;
const supportRows = [
  ["担任の声かけ", "98件", "68%", "-2.1点"],
  ["保護者面談", "76件", "59%", "-1.8点"],
  ["学習支援につなぐ", "84件", "71%", "-2.6点"],
  ["SSW連携", "53件", "63%", "-2.0点"],
  ["地域資源紹介", "41件", "54%", "-1.5点"],
] as const;
const kpis: {
  icon: LucideIcon;
  label: string;
  value: string;
  unit: string;
  note: string;
  tone: string;
}[] = [
  { icon: TrendingUp, label: "改善した生徒", value: "48", unit: "名", note: "前回比 +12", tone: "green" },
  { icon: AlertTriangle, label: "悪化した生徒", value: "7", unit: "名", note: "前回比 +2", tone: "amber" },
  { icon: Users, label: "支援継続中", value: "35", unit: "名", note: "前回比 -3", tone: "blue" },
  { icon: AlertTriangle, label: "未対応のまま悪化", value: "3", unit: "名", note: "前回比 ±0", tone: "red" },
  { icon: PieChart, label: "A/B/C別改善率", value: "A 72% / B 64% / C 51%", unit: "", note: "", tone: "purple" },
  { icon: TrendingDown, label: "平均スクリーニング点数変化", value: "-2.4", unit: "点", note: "前回比 -0.6点", tone: "cyan" },
];

function InfoTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="effects-panel-title">
      {children}
      <HelpCircle aria-hidden="true" />
    </h2>
  );
}

function LineChart({
  values,
  color = "#5478cf",
  secondary,
  tertiary,
}: {
  values: number[];
  color?: string;
  secondary?: number[];
  tertiary?: number[];
}) {
  const points = (data: number[]) =>
    data.map((value, index) => `${28 + index * 68},${112 - value * 8}`).join(" ");
  return (
    <svg className="effects-line-chart" viewBox="0 0 390 150" role="img">
      {[32, 72, 112].map((y) => (
        <line key={y} x1="22" y1={y} x2="378" y2={y} stroke="#e8ebf2" />
      ))}
      <polyline points={points(values)} fill="none" stroke={color} strokeWidth="3" />
      {secondary && (
        <polyline points={points(secondary)} fill="none" stroke="#65a76c" strokeWidth="2.5" />
      )}
      {tertiary && (
        <polyline points={points(tertiary)} fill="none" stroke="#db963d" strokeWidth="2.5" />
      )}
      {values.map((value, index) => (
        <circle key={index} cx={28 + index * 68} cy={112 - value * 8} r="4" fill={color} />
      ))}
      {months.map((month, index) => (
        <text key={month} x={28 + index * 68} y="142" textAnchor="middle">{month}</text>
      ))}
    </svg>
  );
}

export default function SupportEffectsPage() {
  return (
    <div className="support-effects-page">
      <header className="effects-heading">
        <h1>支援効果ダッシュボード <HelpCircle aria-hidden="true" /></h1>
        <p>支援の前後での変化を可視化し、支援の効果を検証します。</p>
      </header>

      <section className="effects-filters" aria-label="絞り込み">
        {[
          ["年度", "2024年度"],
          ["学期", "1学期"],
          ["学年", "すべて"],
          ["クラス", "すべて"],
          ["支援方向性", "すべて"],
        ].map(([label, value]) => (
          <label
            className="effects-unavailable"
            data-tooltip="実装中です"
            key={label}
          >
            {label}
            <select defaultValue={value} disabled>
              <option>{value}</option>
            </select>
          </label>
        ))}
        <button
          type="button"
          className="effects-clear effects-unavailable"
          data-tooltip="実装中です"
          disabled
        >
          <RefreshCw />クリア
        </button>
        <button
          type="button"
          className="effects-report effects-unavailable"
          data-tooltip="実装中です"
          disabled
        >
          <Download />レポート出力
        </button>
      </section>

      <section className="effects-kpis">
        {kpis.map(({ icon: Icon, label, value, unit, note, tone }) => (
          <article className={`effects-kpi effects-${tone}`} key={label}>
            <Icon />
            <div><span>{label}</span><strong>{value}<small>{unit}</small></strong>{note && <b>{note}</b>}</div>
          </article>
        ))}
      </section>

      <section className="effects-main-charts">
        <article className="effects-panel effects-bars">
          <InfoTitle>支援前後の点数変化</InfoTitle>
          <div className="effects-bar-chart">
            {scoreRows.map(([label, before, after]) => (
              <div className="effects-bar-group" key={label}>
                <div><i style={{ height: `${before * 2}px` }}><em>{before}</em></i><i style={{ height: `${after * 2}px` }}><em>{after}</em></i></div>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="effects-legend"><span>■ 支援前</span><span>■ 支援後</span></div>
        </article>
        <article className="effects-panel">
          <InfoTitle>欠席・遅刻・早退の推移</InfoTitle>
          <div className="effects-chart-legend">● 欠席率　 <span>● 遅刻率</span>　 <b>● 早退率</b></div>
          <LineChart values={[8.3, 7.4, 6.6, 5.8, 5.1, 4.6]} secondary={[3.2, 2.9, 2.6, 2.2, 2, 1.8]} tertiary={[1.2, 1.1, 1, 0.9, 0.8, 0.7]} />
        </article>
        <article className="effects-panel">
          <InfoTitle>保健室来室の推移</InfoTitle>
          <LineChart values={[7.8, 7.2, 6.5, 6, 5.2, 4.9]} color="#684eb0" />
        </article>
      </section>

      <section className="effects-analysis-grid">
        <article className="effects-panel">
          <InfoTitle>支援内容と成果の分析</InfoTitle>
          <table><thead><tr><th>支援内容</th><th>件数</th><th>改善率</th><th>平均点数変化</th></tr></thead>
            <tbody>{supportRows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody>
          </table>
          <a className="effects-unavailable" data-tooltip="実装中です">すべて見る　›</a>
        </article>
        <article className="effects-panel">
          <InfoTitle>学期ごとのリスク推移</InfoTitle>
          <div className="effects-risk-chart"><span>22.6</span><span>19.8</span><span>17.3</span><svg viewBox="0 0 300 100"><polygon points="20,25 150,48 280,68 280,92 20,92" fill="#dfe8fa" /><polyline points="20,25 150,48 280,68" fill="none" stroke="#5275c7" strokeWidth="3" /></svg><div>1学期　　　　　2学期　　　　　3学期</div></div>
          <a className="effects-unavailable" data-tooltip="実装中です">詳細を見る　›</a>
        </article>
        <article className="effects-panel">
          <InfoTitle>支援方向性別の効果</InfoTitle>
          <table><thead><tr><th>支援方向性</th><th>改善率</th><th>件数</th><th>平均点数変化</th></tr></thead><tbody>
            <tr><td><mark>A 教職員関与</mark></td><td>72%</td><td>132件</td><td>-2.5点</td></tr>
            <tr><td><mark>B 地域資源の活用</mark></td><td>64%</td><td>98件</td><td>-2.0点</td></tr>
            <tr><td><mark>C 専門機関の活用</mark></td><td>51%</td><td>71件</td><td>-1.6点</td></tr>
          </tbody></table>
          <a className="effects-unavailable" data-tooltip="実装中です">詳細を見る　›</a>
        </article>
        <aside className="effects-panel effects-ai">
          <InfoTitle><Bot /> 自動分析コメント</InfoTitle>
          <p>保護者面談と学習支援を組み合わせたケースで改善傾向が高く見られます。</p>
          <p>未対応のまま悪化したケースは主に家庭状況と欠席増加を伴っています。</p>
          <a className="effects-unavailable" data-tooltip="実装中です">コメントの詳細を見る　›</a>
        </aside>
      </section>

      <section className="effects-student-tables">
        {[
          ["前回より改善した生徒", ["保護者面談、学習支援", "-12.4点", "改善"], ["担任の声かけ、SSW連携", "-9.8点", "改善"]],
          ["注意が必要な生徒（未対応のまま悪化したケース）", ["欠席増加、家庭状況", "+6.3点", "要確認"], ["学習不振、遅刻増加", "+5.1点", "期限超過"]],
        ].map(([title, ...rows]) => (
          <article className="effects-panel" key={title as string}><InfoTitle>{title as string}</InfoTitle>
            <table><thead><tr><th>学年</th><th>クラス</th><th>生徒</th><th>主な支援・課題</th><th>点数変化</th><th>現在状況</th></tr></thead>
              <tbody>{rows.map((row, index) => <tr key={index}><td>{index + 1}年</td><td>{index + 2}組</td><td>＊＊＊＊</td>{(row as string[]).map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </article>
        ))}
      </section>
    </div>
  );
}
