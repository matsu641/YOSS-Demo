import { screeningCategories } from "@/config";
import type { ScreeningSession } from "@/types";

const categoryToneClasses = [
  "score-category-rose",
  "score-category-purple",
  "score-category-green",
  "score-category-violet",
  "score-category-mint",
  "score-category-amber",
  "score-category-blue",
  "score-category-slate",
] as const;

export function ScreeningScoreTable({
  session,
  label = "最新スクリーニング結果",
}: {
  session?: ScreeningSession;
  label?: string;
}) {
  const scoreByItem = new Map(
    session?.responses.map((response) => [
      response.itemId,
      response.score ?? 0,
    ]) ?? [],
  );
  const categoryTotals = screeningCategories.map((category) =>
    category.items.reduce(
      (total, _item, index) =>
        total + (scoreByItem.get(`${category.id}-${index + 1}`) ?? 0),
      0,
    ),
  );
  const total = categoryTotals.reduce((sum, subtotal) => sum + subtotal, 0);
  const evaluation = Math.min(5, Math.max(1, Math.ceil(total / 14)));

  return (
    <div
      className="screening-score-vertical"
      role="region"
      aria-label="スクリーニング点数表"
      tabIndex={0}
    >
      <div className="screening-score-summary">
        <div className="screening-score-summary-label">
          <span>結果</span>
          <b>{label}</b>
        </div>
        <div>
          <span>合計</span>
          <b>{total}</b>
        </div>
        <div className="score-evaluation">
          <span>★評価</span>
          <b>{evaluation}</b>
        </div>
        <div>
          <span>会議</span>
          <b className="score-meeting-mark">会</b>
        </div>
      </div>

      <div className="screening-category-list">
        {screeningCategories.map((category, categoryIndex) => (
          <section className="screening-category-block" key={category.id}>
            <header className={categoryToneClasses[categoryIndex]}>
              <h3>{category.label}</h3>
              <span>
                小計 <b>{categoryTotals[categoryIndex]}</b>
              </span>
            </header>
            <div className="screening-item-grid">
              {category.items.map((item, itemIndex) => (
                <div
                  className="screening-item-score"
                  key={`${category.id}-${itemIndex}`}
                >
                  <span>{item}</span>
                  <b>
                    {scoreByItem.get(`${category.id}-${itemIndex + 1}`) ?? 0}
                  </b>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="screening-memo-section">
        <h3>点数以外のメモ</h3>
        <div className="screening-memo-grid">
          <div>
            <b>会議メモ・SS会議</b>
            <p>{session?.sharedConcernNote || "—"}</p>
          </div>
          <div>
            <b>会議メモ・T会議</b>
            <p>会議で確認予定</p>
          </div>
          <div>
            <b>個人メモ・SS会議</b>
            <p>個人確認メモ</p>
          </div>
          <div>
            <b>個人メモ・T会議</b>
            <p>—</p>
          </div>
        </div>
      </section>
    </div>
  );
}
