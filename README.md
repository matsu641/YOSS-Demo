# YOSS Cloud UI Renewal Prototype

学校内の児童生徒支援情報を整理する、クリック可能なフロントエンドモックです。Next.js App Router、React、strict TypeScript、Tailwind CSSで実装しています。画面内の氏名、住所、電話番号、学校名、記録内容はすべて架空のデモデータです。

## セットアップ

Node.js 20以上を用意し、次のコマンドを実行してください。

```bash
npm install
npm run dev
```

ブラウザで `http://localhost:3000` を開くと `/dashboard` へ移動します。

```bash
npm run lint
npm run test
npm run build
```

## ページ一覧

| URL | 内容 |
| --- | --- |
| `/dashboard` | 要対応アクション、支援方向、要確認生徒、最近の記録、会議導線 |
| `/students` | URLクエリ対応の生徒検索、プリセット、一覧 |
| `/students/[studentId]` | 生徒サマリー、スクリーニング、対応記録、アクション、会議履歴 |
| `/actions` | アクションの絞り込み、作成、編集、状態変更 |
| `/screening/prepare` | 生徒切り替え、スコア・観察事実・情報源・確認状態の入力 |
| `/screening/meeting` | 会議判定、個人／共有メモ、クイックアクション作成 |
| `/team-meeting` | 付議対象生徒の支援候補選択とアクション作成 |
| `/resources` | 静的な地図風表示と架空の地域資源12件 |
| `/settings/flags` | 校内対応フラグの追加、編集、表示切替、削除 |

ダッシュボードのカードは `/actions?status=overdue` や `/students?direction=A&grade=2` のような絞り込み済みURLへ遷移します。

## ダミーデータ

- 生徒36名（各学年6名）
- 教職員10名
- 対応記録72件
- アクション42件
- 生徒ごとのスクリーニング記録
- 会議記録24件
- 校内対応フラグ6件
- 地域資源12件

支援方向なし、A/B/C単独と複数方向、期限超過、担当者未設定、完了後の結果未入力、次回確認日超過、校内チーム会議対象など、画面確認用のケースを含みます。データアクセスは `src/repositories` を境界とし、ページからダミーデータを直接importしません。

## 仮保存

Zustandのpersist middlewareにより、次の編集内容をLocal Storageへ保存します。

- アクションの作成・編集・状態変更
- 対応記録の追加
- スクリーニング入力と共有メモ
- 会議判定・個人メモ・共有メモ
- 校内対応フラグ

ヘッダーのユーザー表示からデモデータを初期化できます。保存先はブラウザ内だけで、サーバーには送信されません。

## 未実装・制約

- バックエンド、データベース、認証・認可、外部API
- 実際のAI推論・採点（会議画面の「AI参考判定・デモ」は静的表示のみ）
- 録音、文字起こし、AI議事録、支援効果分析
- メール、プッシュ通知、CSV入出力
- Google Maps連携（静的な地図風プレースホルダーのみ）
- 本番向けセキュリティ、複数利用者間の同期

利用不能な外部連携ボタンは非活性化し、モック内の補助操作は説明トーストを表示します。

## 構成

- `src/app`: App Routerのページとレイアウト
- `src/components`: 責務別の独自UI・画面コンポーネント
- `src/types`: ドメイン型
- `src/data/mock`: 架空データ
- `src/repositories`: データアクセス境界
- `src/stores`: Zustand / Local Storage状態
- `src/config`: 状態、支援方向、スクリーニング設定
- `src/tests`: Vitest / React Testing Libraryテスト

shadcn/ui、Material UI、Ant DesignなどのUIライブラリは使用していません。
