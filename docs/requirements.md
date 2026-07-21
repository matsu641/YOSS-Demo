# YOSSクラウドサービス UI/UX改善

## フロントエンドモック要件定義書 v1.0

本要件定義は、既存YOSSクラウドサービスの業務構造を維持しながら、ダッシュボード、生徒一覧、生徒個表、アクション管理、スクリーニング準備・会議、校内チーム会議などのUI/UXを再設計するものです。

既存システムには、A・B・C別の集計、対応記録、アクション記録、会議準備・実施、生徒一覧、生徒個表、地域資源、校内対応フラグなどが存在します。
今回のモックでは、ダッシュボードからの絞り込み遷移、アクションの状態表示、検索条件の整理、具体的事実とスコアの併記、会議画面の情報整理など、既存機能の利用体験改善を優先します。

---

# 1. プロジェクト概要

## 1.1 プロジェクト名

**YOSS Cloud UI Renewal Prototype**

## 1.2 目的

既存YOSSクラウドサービスの機能構成を大きく変えず、以下を改善する。

1. 教職員が「次に何を確認・対応すべきか」を短時間で把握できる。
2. 生徒に関する情報を、点数の羅列ではなく意味のある単位で理解できる。
3. 会議で決定したアクションの担当者、期限、進行状態を確認できる。
4. スクリーニング準備や会議画面のスクロール量と認知負荷を減らす。
5. 生徒一覧の検索・絞り込み操作を簡単にする。
6. UIデザインを統一し、文字の可読性、情報階層、操作の一貫性を改善する。
7. 将来バックエンドを接続できる構造で、フロントエンドモックを構築する。

## 1.3 成果物

以下を含むNext.jsアプリケーションを作成する。

* 各画面を遷移できるクリック可能なUIモック
* ダミーの児童生徒データ
* ダミーの対応記録・アクション・会議記録
* フィルター、モーダル、ドロワー、タブなどの操作
* ローカル状態による簡易CRUD
* ブラウザ再読み込み後も一部変更を保持するLocal Storage
* README
* 基本的なコンポーネントテスト

---

# 2. 開発範囲

## 2.1 今回実装するもの

### 主要画面

1. ダッシュボード
2. 生徒一覧
3. 生徒個表
4. アクション一覧
5. スクリーニング会議の準備
6. スクリーニング会議の実施
7. 校内チーム会議の実施
8. 地域資源一覧
9. 校内対応フラグ設定

### 共通操作

* サイドナビゲーション
* パンくず
* 年度・学校表示
* 絞り込み
* 並び替え
* タブ切り替え
* 生徒切り替え
* モーダル
* 右サイドドロワー
* トースト通知
* ダミーデータの更新
* Local Storageへの保存
* デモデータ初期化

## 2.2 今回実装しないもの

以下は明確にスコープ外とする。

* 実際のバックエンドAPI
* データベース
* 本物の認証・認可
* 自治体・学校間の権限管理
* 実際のAI推論
* AIによる自動採点
* AI判定根拠の生成
* 会議録音
* 文字起こし
* AI議事録要約
* 支援効果ダッシュボード
* 支援効果の統計分析
* メール・プッシュ通知
* 本物のGoogle Maps連携
* CSVインポート・エクスポート
* 本番用セキュリティ設計
* 実在する児童生徒データ

## 2.3 モックにおける「動作」の定義

バックエンド処理は不要だが、UI検証に必要な操作は動作させる。

動作させるもの：

* カードクリックによる画面遷移
* URLクエリを使った絞り込み
* 検索と並び替え
* タブ切り替え
* モーダルの開閉
* アクションの作成・編集
* ステータス変更
* メモ入力
* スコア選択
* 生徒の前後移動
* Local Storageへの仮保存

動作させないもの：

* 外部サービスへの送信
* 実際のAI処理
* 本物の通知送信
* 本物の地図検索
* サーバーへの永続保存

未実装の操作は反応しないボタンとして放置せず、次のいずれかにする。

* 非活性状態にする
* 「デモ版では利用できません」とツールチップ表示する
* クリック時に説明トーストを表示する

---

# 3. 想定利用者

今回のモックでは実際の権限制御は実装しないが、以下の利用者を想定してUIを設計する。

## 3.1 学級担任

主な作業：

* 担当生徒の確認
* スクリーニング項目の入力
* 気になる情報の記録
* 対応記録の登録
* 担当アクションの確認
* 会議前後の情報確認

## 3.2 養護教諭・特別支援担当・生徒指導担当

主な作業：

* 専門領域の情報入力
* 生徒の過去情報確認
* 会議での情報共有
* 支援アクションの実施
* 経過記録

## 3.3 管理職・会議進行担当

主な作業：

* 学校全体の対応状況確認
* 未対応・期限超過アクションの確認
* スクリーニング会議の進行
* 校内チーム会議への対象者選定
* 支援方向A・B・Cの決定
* アクションの担当者・期限設定

---

# 4. UX基本方針

## 4.1 行動を中心に表示する

単なる件数ではなく、ユーザーが次に取るべき行動を優先して表示する。

優先表示例：

* 期限を超過したアクション
* 担当者未設定のアクション
* 次回確認日を過ぎた生徒
* スクリーニング入力が未完了の生徒
* 校内チーム会議で未判定の生徒

## 4.2 段階的に情報を開示する

一画面にすべての情報を並べない。

初期表示：

* 現在の状態
* 要確認事項
* 直近の対応
* 次のアクション

詳細情報：

* タブ
* アコーディオン
* ドロワー
* 詳細ページ

を使って必要な場合だけ表示する。

## 4.3 色だけに依存しない

状態は必ず文字、アイコン、色を組み合わせる。

例：

* 赤色＋警告アイコン＋「期限超過」
* 緑色＋チェックアイコン＋「完了」
* 黄色＋時計アイコン＋「期限間近」

## 4.4 AIと人間の判断を区別する

今回AI処理は行わないが、既存機能を再現するため静的なAI参考判定を表示する。

表示は明確に分ける。

* 「AI参考判定・デモ」
* 「会議での最終判定」

AI参考判定を正式決定のように見せない。

## 4.5 観察事実と推測を区別する

スクリーニング項目の背景情報は、以下を分離する。

* 観察された事実
* 情報源
* 確認状況
* 補足メモ

「弁当を持参していない」という事実と、「家庭の困窮があるかもしれない」という未確認の推測を同一欄に混在させない。

---

# 5. 技術要件

## 5.1 技術スタック

* Next.js
* React
* TypeScript
* App Router
* Tailwind CSS
* Zustand
* React Hook Form
* Zod
* Lucide React
* date-fns
* clsx
* tailwind-merge
* Vitest
* React Testing Library
* ESLint
* Prettier

## 5.2 使用しないもの

* shadcn/ui
* Material UI
* Ant Design
* Chakra UI
* 実際のバックエンドSDK
* Firebase
* Supabase
* Prisma
* Google Maps API
* 外部AI API

UIコンポーネントはTailwind CSSと独自コンポーネントで実装する。

## 5.3 TypeScript

以下を必須とする。

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

`any`は原則禁止する。

## 5.4 レンダリング方針

* App Routerを使用する
* レイアウト、ページシェルはServer Componentでよい
* フィルター、フォーム、テーブル、モーダルなどの操作部分はClient Componentにする
* アプリ全体を不必要に`use client`にしない
* ダミーデータへのアクセスもサービス層を経由する

---

# 6. ルーティング

```text
/
└─ /dashboard にリダイレクト

/dashboard
/students
/students/[studentId]
/actions
/screening/prepare
/screening/meeting
/team-meeting
/resources
/settings/flags
```

## 6.1 URLクエリ

フィルター状態を可能な範囲でURLに保持する。

例：

```text
/students?grade=2&direction=A&actionStatus=overdue
/actions?status=in-progress&assignee=current-user
/screening/prepare?grade=3&class=1
```

これにより、ダッシュボードのカードから絞り込み済みページに直接遷移できるようにする。

---

# 7. 共通レイアウト

## 7.1 サイドバー

デスクトップでは左側に固定表示する。

メニュー構成：

```text
YOSS Cloud

ダッシュボード

生徒支援
  生徒一覧
  アクション一覧

会議
  スクリーニング準備
  スクリーニング会議
  校内チーム会議

地域連携
  地域資源

設定
  校内対応フラグ
```

仕様：

* 現在のページを強調表示
* アイコンとラベルを併記
* 折りたたみ可能
* 折りたたみ時もツールチップで名称表示
* タブレットではオーバーレイメニューにする

## 7.2 ヘッダー

表示項目：

* パンくず
* 学校名「YOSSデモ小学校」
* 年度「2026年度」
* 通知アイコン
* ユーザー名「山田 管理職」
* アバター
* デモデータ初期化メニュー

通知は実際には送信せず、ダミー件数を表示する。

## 7.3 ページヘッダー

全ページ共通で以下を使用する。

* ページタイトル
* 1行の説明
* 主要CTA
* 必要に応じて補助CTA

例：

```text
生徒一覧
児童生徒の支援状況、アクション、スクリーニング結果を確認します。

[対応記録を追加] [アクションを追加]
```

---

# 8. 画面別要件

# 8.1 ダッシュボード

## 目的

学校全体の状況を確認し、次に確認すべき生徒・アクションへ直接移動できるようにする。

## レイアウト

上から以下の順に配置する。

### 1. 要対応アクションカード

表示するカード：

* 期限超過
* 期限間近
* 対応中
* 要再確認

各カードに以下を表示する。

* 件数
* 前回比または補足
* 対象生徒数
* アイコン
* 状態ラベル

カードクリック時：

```text
期限超過カード
→ /actions?status=overdue
```

完了件数はファーストビューに大きく表示せず、補助的な位置に置く。

### 2. 支援方向サマリー

A・B・Cをカードで表示する。

* A：教職員関与
* B：地域資源の活用
* C：専門機関の活用

カード内に学年別人数を表示する。

例：

```text
A 教職員関与
合計 12名

1年 2名
2年 4名
3年 1名
4年 3名
5年 1名
6年 1名
```

学年の人数をクリックした場合：

```text
/students?direction=A&grade=2
```

カード全体をクリックした場合：

```text
/students?direction=A
```

### 3. 要確認の生徒

ルールベースのダミー表示とする。

表示理由例：

* アクション期限超過
* 次回確認日超過
* 前回スコアから急変
* アクション担当者未設定

表示項目：

* 生徒名
* 学年・クラス
* 支援方向
* 要確認理由
* 次回確認日
* 詳細ボタン

AIによる優先順位とは表記しない。

### 4. 最近の対応記録

直近5件を表示する。

* 日付
* 生徒名
* 記録種別
* 内容の冒頭
* 登録者

「すべて見る」で対象生徒または一覧へ遷移する。

### 5. 会議ショートカット

3つのカードを表示する。

* スクリーニング会議を準備する
* スクリーニング会議を実施する
* 校内チーム会議を実施する

## ダッシュボード受入条件

* 支援方向カードから絞り込み済み生徒一覧へ移動できる
* 要対応カードから絞り込み済みアクション一覧へ移動できる
* 初期状態で空白画面にならない
* 画面幅1280pxで主要情報がファーストビューに収まる
* 色だけで状態を表現しない

---

# 8.2 生徒一覧

## 目的

対象生徒の検索と、現在の支援状況の比較を短時間で行えるようにする。

## 初期表示

検索ボタンを押す前から以下を表示する。

* 最近確認した生徒
* 要確認の生徒
* 全生徒一覧の先頭20件

「検索するまで何も表示されない」状態は禁止する。

## プリセット

画面上部にワンクリックプリセットを表示する。

* 自分の担当生徒
* 期限超過あり
* 前回から悪化
* アクション未登録
* 校内チーム会議対象
* 次回確認日超過
* 最近更新された生徒

プリセットを押した場合、フィルターへ条件を反映する。

## 基本フィルター

常時表示：

* 年度
* 学年
* クラス
* 生徒名
* 支援方向
* アクション状態

詳細フィルター内：

* 校内対応フラグ
* 校内チーム会議対象
* 次回確認日
* 合計点範囲
* 前回からの変化
* 担当者
* 最終更新日

選択済み条件をチップ表示する。

```text
[2年生 ×] [A 教職員関与 ×] [期限超過 ×]
```

## テーブル列

```text
生徒
学年・クラス
支援方向
校内フラグ
最新スコア
前回比
進行中アクション
次回確認日
最終更新
操作
```

### 生徒列

* 生徒名
* 出席番号
* 小さなアバター
* 重要な校内フラグを最大2件表示

### 支援方向

A・B・Cをバッジで表示する。

複数方向が設定されている場合は複数表示する。

### 最新スコア

合計点のみを大きく表示しすぎない。

表示例：

```text
23点
学級 8 / 家庭 6 / 養護 4
```

すべてのカテゴリ数値を横一列に並べない。

### 前回比

* `+5` 悪化
* `-3` 改善
* `±0` 変化なし

「高い点数が悪い」という前提のダミーデータとする。

### アクション

表示例：

```text
対応中 2
期限超過 1
```

### 行操作

* 詳細を見る
* 対応記録を追加
* アクションを追加

## 並び替え

* 生徒名
* 学年
* 最新スコア
* 前回比
* 次回確認日
* 最終更新日
* 期限超過数

## 表示形式

デスクトップ：

* テーブル表示

タブレット以下：

* カード表示

## 受入条件

* 初期状態で生徒が表示される
* フィルターをURLへ反映できる
* プリセットをワンクリックで適用できる
* 条件をすべて解除できる
* 期限超過のある生徒を明確に識別できる
* 行全体をクリックして生徒個表へ遷移できる
* テーブルヘッダーがスクロール時に固定される

---

# 8.3 生徒個表

## 目的

一人の生徒について、現在の状態、支援方向、記録、アクション、会議履歴を整理して確認する。

## 固定生徒ヘッダー

画面上部に固定表示する。

表示項目：

* 生徒名
* 学年・クラス
* 出席番号
* 支援方向A・B・C
* 校内対応フラグ
* 最終更新日
* 前の生徒
* 次の生徒
* 生徒選択ドロップダウン

## サマリーカード

4枚表示する。

* 最新スクリーニング点数
* 前回からの変化
* 未完了アクション
* 次回確認日

## タブ

```text
概要
スクリーニング
対応記録
アクション
会議履歴
```

## 概要タブ

### 現在の支援状況

* A・B・Cの支援方向
* 支援開始日
* 担当者
* 現在の簡単な状況

### 要確認事項

* 期限超過
* 次回確認日
* 未完了アクション
* 会議で保留となった事項

### 活動タイムライン

高度な支援効果分析ではなく、既存データを時系列に表示する。

表示対象：

* スクリーニング実施
* 会議実施
* 支援方向変更
* 対応記録追加
* アクション作成
* アクション完了
* 次回確認日の設定

表示例：

```text
2026年7月15日
担任面談を実施
担当：山田先生
本人から最近の欠席について聞き取りを実施
[対応記録を見る]
```

「支援によって改善した」といった因果関係は表示しない。

## スクリーニングタブ

最新結果をカテゴリ別に表示する。

カテゴリ例：

* 学校生活・問題行動
* 学習
* 家庭状況
* 特別支援
* 養護
* 事務
* 地域・調査

各カテゴリには以下を表示する。

* 合計
* 前回比
* 高い項目上位3件
* 関連する具体的事実
* 詳細を開くボタン

## 対応記録タブ

対応記録一覧をカード形式で表示する。

項目：

* 日付
* 記録種別
* 件名
* 内容
* 記録者
* 最終更新者
* 関連タグ

「対応記録を追加」でモーダルを開く。

## アクションタブ

以下の状態でグループ化する。

* 期限超過
* 対応中
* 未着手
* 要再確認
* 完了
* 保留

## 会議履歴タブ

会議ごとに以下を表示する。

* 会議種別
* 実施日
* 会議判定
* 支援方向
* 共有会議メモ
* 決定したアクション
* 詳細を開く

## 受入条件

* 生徒の現在状態が画面上部だけで把握できる
* 詳細ログを読まなくても未完了アクションが分かる
* 前後の生徒へ移動できる
* タイムラインから元記録を開ける
* 対応記録とアクションを混同しない表示にする

---

# 8.4 アクション一覧

## 目的

会議で決定した支援が、誰によって、いつまでに、どの状態で実施されるのかを一覧管理する。

## ステータス

```typescript
type ActionStatus =
  | "not-started"
  | "in-progress"
  | "completed"
  | "on-hold"
  | "needs-review";
```

日本語表示：

* 未着手
* 対応中
* 完了
* 保留
* 要再確認

期限を過ぎていて完了していない場合、ステータスとは別に「期限超過」を表示する。

## 優先度

```typescript
type ActionPriority = "high" | "medium" | "low";
```

表示：

* 高
* 中
* 低

優先度はユーザー入力のダミー値であり、AI判定ではない。

## 一覧列

```text
優先度
対象生徒
支援方向
アクション内容
担当者
期限
ステータス
次回確認日
最終更新
操作
```

## フィルター

* ステータス
* 期限超過
* 優先度
* 担当者
* 学年
* 支援方向
* 次回確認日
* 生徒名

## アクション詳細ドロワー

一覧の「詳細」を押すと右側から開く。

表示・編集項目：

* 対象生徒
* 支援方向
* アクション内容
* 担当者
* 優先度
* 開始日
* 期限
* ステータス
* 次回確認日
* 実施内容
* 結果メモ
* 作成元会議
* 作成者
* 最終更新日

## アクション作成モーダル

必須：

* 対象生徒
* 内容
* 担当者
* 期限
* 支援方向

任意：

* 優先度
* 次回確認日
* 補足
* 作成元会議

保存後：

* Zustandストアへ追加
* Local Storageへ保存
* 成功トーストを表示
* 一覧へ反映

## 受入条件

* ステータスを変更できる
* 期限超過が自動表示される
* 担当者・期限・対象生徒が一覧で分かる
* ステータスと結果を別項目で管理する
* 完了しても結果メモが空の場合は入力を促す表示を出す

---

# 8.5 スクリーニング会議の準備

## 目的

複数の担当者が担当領域の情報を入力し、会議前に共有可能な状態を作る。

## 画面上部

固定表示：

* 会議種別
* 年度
* 学期
* 学年
* クラス
* 対象生徒
* 入力進捗
* 保存状態

保存状態例：

```text
保存済み
保存中...
未保存の変更があります
```

実際にはLocal Storageへ保存する。

## 生徒ナビゲーション

* 生徒選択ドロップダウン
* 前の生徒
* 次の生徒
* `8 / 32人`の進捗
* 入力済み・未入力の状態

## タブ

```text
支援の現状
データ
自由記述
学級
特別支援
養護
事務
管理職・生徒指導
地域・調査
その他・備考
```

## スクリーニング項目

各項目をカード形式にする。

表示内容：

* 項目名
* 判断基準のヘルプ
* スコア選択
* 観察された事実
* 情報源
* 確認状態
* 補足

### スコア

正確なスコア尺度は資料だけでは確定できないため、設定ファイルで変更できるようにする。

暫定設定：

```typescript
export const SCREENING_SCORE_OPTIONS = [0, 1, 2] as const;
```

UIをスコア数に依存させず、将来的に0〜5や0〜10へ変更可能にする。

### 観察事実

入力欄例：

```text
観察された事実
例：今週、昼食を持参していない日が3日あった
```

### 情報源

選択肢：

* 教職員が直接確認
* 本人から聞き取り
* 保護者から聞き取り
* 他の生徒からの情報
* 外部機関からの情報
* 未確認

### 確認状態

* 確認済み
* 一部確認
* 未確認

## 自由記述

会議で共有する「気になる情報」として表示する。

注意文：

```text
この内容はスクリーニング会議および校内チーム会議で共有されます。
観察した事実と推測を分けて記載してください。
```

## 受入条件

* タブごとに入力できる
* 生徒を前後に移動できる
* 入力内容がLocal Storageに保存される
* 画面を再読み込みしても入力が残る
* スコアと具体的事実を関連付けられる
* 保存状態が視覚的に分かる
* 長いフォームでも生徒ヘッダーが見失われない

---

# 8.6 スクリーニング会議

## 目的

事前入力情報を確認し、校内チーム会議へ上げるか、暫定的な支援方向をどうするかを決定する。

## レイアウト

デスクトップでは2カラムとする。

```text
左側：生徒情報・スクリーニング情報
右側：判定・メモ・アクション
```

右側の判定パネルはスクロール時に固定する。

## 左側タブ

* サマリー
* スクリーニングデータ
* 対応記録
* アクション
* 過去の会議

## サマリー

表示内容：

* 生徒基本情報
* 支援方向
* 校内フラグ
* 合計点
* 前回比
* 高いカテゴリ
* 自由記述
* 要確認事項

## AI参考判定

静的ダミー表示とする。

例：

```text
AI参考判定・デモ

校内チーム会議への付議：
付議を推奨

参考支援方向：
A 教職員関与

この表示はダミーデータであり、実際のAI処理は行っていません。
```

AIの確信度は表示しない。

## 会議での判定

入力項目：

* 校内チーム会議へ上げる
* 上げない
* 保留

支援方向：

* A 教職員関与
* B 地域資源の活用
* C 専門機関の活用
* 複数選択可能

## メモ

### 個人メモ

* 現在のユーザーのみが見る想定
* モックではラベル表示のみで実際の権限制御は行わない

### 会議メモ

* 学校内共有を想定
* 大きめのテキストエリア
* 保存状態を表示

## クイックアクション作成

会議中に以下を入力できる。

* アクション内容
* 担当者
* 期限
* 支援方向

## 下部操作

* 下書き保存
* 判定を保存
* 前の生徒
* 次の生徒
* 校内チーム会議へ進む

## 受入条件

* 判定パネルが常に見える
* 主要情報を見るために長距離スクロールを必要としない
* AI参考判定と会議判定が視覚的に分離される
* 会議中にアクションを追加できる
* 個人メモと会議メモが明確に区別される

---

# 8.7 校内チーム会議

## 目的

スクリーニング会議で付議された生徒について、具体的な支援方向とアクションを決定する。

## 対象生徒

`teamMeetingRequired === true`の生徒のみ表示する。

## レイアウト

スクリーニング会議画面と共通構造にする。

左側：

* 生徒背景
* スクリーニングデータ
* 過去の対応記録
* 既存アクション
* 前回会議

右側固定パネル：

* 支援方向
* 支援内容
* 担当者
* 期限
* 会議メモ
* 保存

## 支援方向

A・B・Cごとに支援候補をチェックボックス表示する。

### A 教職員関与

例：

* 担任による面談
* 養護教諭による定期確認
* 生徒指導担当による対応
* 特別支援担当との連携
* SSWとの校内連携
* SCとの校内連携

### B 地域資源の活用

例：

* 学習支援
* 地域の居場所
* 子ども食堂
* 家庭教育支援
* 地域福祉サービス

### C 専門機関の活用

例：

* 児童相談所
* 家庭児童相談室
* 教育センター
* 少年サポートセンター
* 医療・福祉相談機関

選択した支援候補から、アクション作成フォームを自動生成する。

## 受入条件

* 付議された生徒だけが表示される
* A・B・Cを見比べながら選択できる
* 支援候補からアクションを作成できる
* 担当者と期限を設定できる
* 会議決定とAI参考情報が分離される

---

# 8.8 地域資源

## 目的

学校周辺の地域資源を視覚的に確認する既存機能をモックとして再現する。

## レイアウト

左側：

* 地図風のプレースホルダー
* ダミーピン

右側：

* 地域資源一覧
* 絞り込み
* 詳細

## 絞り込み

* 学習支援
* 子ども食堂
* 居場所
* 福祉相談
* 医療
* 行政
* その他

## 地図

Google Mapsは使用しない。

静的な地図風背景と絶対配置したダミーピンを使用する。

ピンクリック時：

* 対応する地域資源カードを選択
* 詳細ドロワーを開く

## 地域資源情報

* 名称
* 種別
* 住所
* 電話番号
* 対象年齢
* 利用時間
* 説明
* 学校からの距離
* 対応可能な支援方向

すべてダミーデータとする。

---

# 8.9 校内対応フラグ設定

## 目的

学校独自の分類ラベルを管理する既存画面を、分かりやすく再設計する。

## 一覧

表示項目：

* プレビュー
* 表示名
* 省略文字
* 説明
* 色
* 使用中の生徒数
* 表示状態
* 操作

## 操作

* 追加
* 編集
* 非表示
* 削除
* プレビュー

削除時は確認ダイアログを表示する。

## フラグ編集

入力項目：

* 表示名
* 省略文字
* 説明
* 色
* 表示状態

省略文字は初期値として表示名の先頭1文字を設定するが、編集可能にする。

---

# 9. 共通コンポーネント

以下を独自実装する。

```text
Button
IconButton
Input
Textarea
Select
Checkbox
RadioGroup
ScoreSelector
Badge
StatusBadge
SupportDirectionBadge
InternalFlagBadge
Card
StatCard
AlertCard
Tabs
Accordion
Modal
ConfirmDialog
Drawer
Toast
Tooltip
Breadcrumb
PageHeader
SearchFilterBar
ActiveFilterChips
DataTable
EmptyState
Skeleton
ErrorState
StudentHeader
StudentSelector
ActionStatusSelect
Timeline
```

## 9.1 Button

バリアント：

* primary
* secondary
* outline
* ghost
* danger

サイズ：

* sm
* md
* lg

## 9.2 StatusBadge

状態とデザインを集中管理する。

```typescript
const actionStatusConfig = {
  "not-started": {
    label: "未着手",
    icon: Circle
  },
  "in-progress": {
    label: "対応中",
    icon: Clock
  },
  completed: {
    label: "完了",
    icon: CheckCircle
  },
  "on-hold": {
    label: "保留",
    icon: PauseCircle
  },
  "needs-review": {
    label: "要再確認",
    icon: RefreshCw
  }
};
```

色をコンポーネント外で個別指定しない。

---

# 10. データモデル

## 10.1 生徒

```typescript
export type SupportDirection = "A" | "B" | "C";

export interface Student {
  id: string;
  studentCode: string;
  name: string;
  nameKana: string;
  grade: number;
  className: string;
  attendanceNumber: number;
  supportDirections: SupportDirection[];
  internalFlagIds: string[];
  latestScreeningScore: number | null;
  previousScreeningScore: number | null;
  nextReviewDate: string | null;
  teamMeetingRequired: boolean;
  assignedTeacherId: string;
  lastUpdatedAt: string;
}
```

## 10.2 教職員

```typescript
export type StaffRole =
  | "homeroom-teacher"
  | "school-nurse"
  | "special-support"
  | "student-guidance"
  | "manager"
  | "office"
  | "social-worker"
  | "counselor";

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  avatarInitials: string;
}
```

## 10.3 対応記録

```typescript
export type SupportRecordType =
  | "observation"
  | "interview"
  | "parent-contact"
  | "external-contact"
  | "other";

export interface SupportRecord {
  id: string;
  studentId: string;
  type: SupportRecordType;
  title: string;
  content: string;
  occurredAt: string;
  createdBy: string;
  updatedAt: string;
  tags: string[];
}
```

## 10.4 アクション

```typescript
export type ActionStatus =
  | "not-started"
  | "in-progress"
  | "completed"
  | "on-hold"
  | "needs-review";

export type ActionPriority = "high" | "medium" | "low";

export interface SupportAction {
  id: string;
  studentId: string;
  title: string;
  description: string;
  direction: SupportDirection;
  assigneeId: string | null;
  priority: ActionPriority;
  status: ActionStatus;
  startDate: string | null;
  dueDate: string | null;
  nextReviewDate: string | null;
  completedAt: string | null;
  resultNote: string;
  sourceMeetingId: string | null;
  createdAt: string;
  updatedAt: string;
}
```

## 10.5 スクリーニング項目

```typescript
export type ScreeningCategory =
  | "school-life"
  | "learning"
  | "family"
  | "special-support"
  | "health"
  | "office"
  | "management"
  | "community"
  | "other";

export type InformationSource =
  | "direct-observation"
  | "student"
  | "guardian"
  | "other-student"
  | "external-organization"
  | "unconfirmed";

export type VerificationStatus =
  | "verified"
  | "partially-verified"
  | "unverified";

export interface ScreeningItemDefinition {
  id: string;
  category: ScreeningCategory;
  label: string;
  description: string;
  maxScore: number;
}

export interface ScreeningResponse {
  itemId: string;
  score: number | null;
  observedFact: string;
  informationSource: InformationSource | null;
  verificationStatus: VerificationStatus | null;
  note: string;
}
```

## 10.6 スクリーニング記録

```typescript
export interface ScreeningSession {
  id: string;
  studentId: string;
  academicYear: number;
  term: string;
  meetingType: string;
  responses: ScreeningResponse[];
  sharedConcernNote: string;
  totalScore: number;
  completedAt: string | null;
  updatedAt: string;
}
```

## 10.7 会議

```typescript
export type MeetingType =
  | "screening"
  | "school-team";

export type TeamMeetingDecision =
  | "refer"
  | "do-not-refer"
  | "pending";

export interface MeetingRecord {
  id: string;
  studentId: string;
  type: MeetingType;
  heldAt: string;
  privateMemo: string;
  sharedMemo: string;
  teamMeetingDecision: TeamMeetingDecision | null;
  selectedDirections: SupportDirection[];
  selectedSupportOptions: string[];
  createdActionIds: string[];
  updatedAt: string;
}
```

## 10.8 校内対応フラグ

```typescript
export interface InternalFlag {
  id: string;
  name: string;
  shortLabel: string;
  description: string;
  colorToken: string;
  isVisible: boolean;
}
```

## 10.9 地域資源

```typescript
export interface RegionalResource {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  openingHours: string;
  description: string;
  distanceFromSchoolKm: number;
  supportedDirections: SupportDirection[];
  mapPosition: {
    x: number;
    y: number;
  };
}
```

---

# 11. ダミーデータ要件

## 11.1 データ量

最低限、以下を用意する。

* 生徒：36名
* 各学年：6名
* 教職員：10名
* 対応記録：60件以上
* アクション：30件以上
* スクリーニング記録：各生徒1〜3回
* 会議記録：20件以上
* 校内フラグ：6件
* 地域資源：12件

## 11.2 必要なケース

UIの確認用に、以下のパターンを必ず含める。

* 支援方向がない生徒
* Aのみ
* Bのみ
* Cのみ
* AとBの両方
* A・B・Cすべて
* 校内フラグが複数ある生徒
* アクションがない生徒
* 期限超過アクションがある生徒
* 担当者未設定のアクション
* 完了済みだが結果未入力
* 次回確認日超過
* 前回よりスコアが上昇
* 前回よりスコアが低下
* 過去データが存在しない生徒
* 長文メモがある生徒
* 校内チーム会議対象
* 校内チーム会議対象外

## 11.3 個人情報

* 実在人物の氏名を使用しない
* 架空名であることをREADMEに記載する
* 住所や電話番号も完全なダミーにする
* 画面のヘッダーに「デモデータ」と表示する

---

# 12. 状態管理

## 12.1 Zustandストア

以下のストアに分割する。

```text
useStudentStore
useActionStore
useRecordStore
useScreeningStore
useMeetingStore
useFlagStore
useUiStore
```

## 12.2 Local Storage

保存対象：

* 作成・編集したアクション
* 作成した対応記録
* スクリーニング入力
* 会議メモ
* 校内対応フラグ
* 最近確認した生徒
* 保存済み検索プリセット

保存しなくてよいもの：

* 一時的なモーダル状態
* 現在開いているタブ
* トースト
* ホバー状態

## 12.3 初期化

ヘッダーメニューに「デモデータを初期状態に戻す」を設置する。

操作時：

1. 確認ダイアログを表示
2. Local Storageを削除
3. 初期ダミーデータを再読み込み
4. ダッシュボードへ遷移
5. 完了トーストを表示

---

# 13. モックAPI層

画面からダミーデータを直接importしない。

以下のようなサービス関数を作成する。

```typescript
export interface StudentRepository {
  getAll(filters?: StudentFilters): Promise<Student[]>;
  getById(id: string): Promise<Student | null>;
  update(id: string, input: Partial<Student>): Promise<Student>;
}

export interface ActionRepository {
  getAll(filters?: ActionFilters): Promise<SupportAction[]>;
  create(input: CreateActionInput): Promise<SupportAction>;
  update(
    id: string,
    input: Partial<SupportAction>
  ): Promise<SupportAction>;
}
```

モック実装では100〜300ms程度の疑似遅延を入れてよい。

将来的にREST APIへ置換しやすくする。

---

# 14. デザインシステム

## 14.1 基本方針

* 白を基調とする
* 背景は薄いグレー
* カード間の境界を明確にする
* 強い色を多用しない
* 重要情報だけを強調する
* 文字サイズを小さくしすぎない
* 横スクロールを極力避ける
* 学校業務システムとして落ち着いた外観にする

## 14.2 フォント

```css
font-family:
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  "Noto Sans JP",
  "Hiragino Kaku Gothic ProN",
  sans-serif;
```

## 14.3 文字サイズ

* ページタイトル：24〜28px
* セクションタイトル：18〜20px
* 本文：14〜16px
* 補足：12〜13px
* テーブル本文：14px未満にしない

## 14.4 色の役割

支援方向：

* A：インディゴ系
* B：グリーン系
* C：アンバー系

状態：

* 期限超過：レッド系
* 期限間近：オレンジ系
* 対応中：ブルー系
* 完了：グリーン系
* 保留：グレー系
* 要再確認：パープル系

A・B・Cの色と、ステータス色の意味が混同されないようにする。

## 14.5 余白

4px単位のスペーシングシステムを使用する。

```text
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48
```

## 14.6 角丸

* カード：12px
* ボタン：8px
* 入力欄：8px
* バッジ：9999px

## 14.7 影

強いドロップシャドウは使用しない。

カードは境界線と薄い影を使用する。

---

# 15. アクセシビリティ

最低限、以下を満たす。

* すべての入力欄にlabelを設定
* アイコンだけのボタンに`aria-label`
* キーボード操作可能
* フォーカスリングを非表示にしない
* モーダル表示時にフォーカストラップ
* Escapeキーでモーダルを閉じる
* 色だけで状態を伝えない
* 文字と背景のコントラストを確保
* エラー内容を文字で表示
* テーブルに適切な見出しを設定
* ボタンのクリック領域を最低40px程度にする

---

# 16. レスポンシブ要件

今回はWeb盤のみで可。

## デスクトップ

対象：

* 1280px以上
* 主な設計基準は1440px

仕様：

* 固定サイドバー
* 2カラム会議画面
* テーブル表示
* 右固定ドロワー

---

# 17. ローディング・空状態・エラー状態

## ローディング

* スケルトンを表示
* ページ全体のスピナーだけにしない
* テーブル行、カード単位でスケルトン表示

## 空状態

例：

```text
該当する生徒が見つかりませんでした。
検索条件を変更するか、条件をすべて解除してください。

[条件をクリア]
```

## データ未登録

例：

```text
この生徒には対応記録がまだありません。

[最初の対応記録を追加]
```

## エラー

モックでは意図的なエラー表示を確認できるデバッグ手段を用意してもよい。

---

# 18. フォルダー構成

```text
src/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ (app)/
│     ├─ layout.tsx
│     ├─ dashboard/
│     │  └─ page.tsx
│     ├─ students/
│     │  ├─ page.tsx
│     │  └─ [studentId]/
│     │     └─ page.tsx
│     ├─ actions/
│     │  └─ page.tsx
│     ├─ screening/
│     │  ├─ prepare/
│     │  │  └─ page.tsx
│     │  └─ meeting/
│     │     └─ page.tsx
│     ├─ team-meeting/
│     │  └─ page.tsx
│     ├─ resources/
│     │  └─ page.tsx
│     └─ settings/
│        └─ flags/
│           └─ page.tsx
│
├─ components/
│  ├─ ui/
│  ├─ layout/
│  ├─ dashboard/
│  ├─ students/
│  ├─ actions/
│  ├─ screening/
│  ├─ meetings/
│  ├─ resources/
│  └─ flags/
│
├─ config/
│  ├─ navigation.ts
│  ├─ screening.ts
│  ├─ support-directions.ts
│  └─ status.ts
│
├─ data/
│  └─ mock/
│     ├─ students.ts
│     ├─ staff.ts
│     ├─ actions.ts
│     ├─ records.ts
│     ├─ screenings.ts
│     ├─ meetings.ts
│     ├─ flags.ts
│     └─ resources.ts
│
├─ repositories/
│  ├─ student-repository.ts
│  ├─ action-repository.ts
│  ├─ record-repository.ts
│  ├─ screening-repository.ts
│  └─ mock/
│
├─ stores/
│  ├─ student-store.ts
│  ├─ action-store.ts
│  ├─ record-store.ts
│  ├─ screening-store.ts
│  ├─ meeting-store.ts
│  ├─ flag-store.ts
│  └─ ui-store.ts
│
├─ types/
│  ├─ student.ts
│  ├─ action.ts
│  ├─ record.ts
│  ├─ screening.ts
│  ├─ meeting.ts
│  ├─ flag.ts
│  └─ resource.ts
│
├─ hooks/
│  ├─ use-query-filters.ts
│  ├─ use-local-storage.ts
│  └─ use-debounced-value.ts
│
├─ lib/
│  ├─ cn.ts
│  ├─ date.ts
│  ├─ filters.ts
│  ├─ storage.ts
│  └─ validation.ts
│
└─ tests/
   ├─ dashboard.test.tsx
   ├─ student-list.test.tsx
   ├─ action-form.test.tsx
   └─ screening-form.test.tsx
```

---

# 19. 実装順序

## Step 1：基盤

* Next.jsプロジェクト作成
* TypeScript strict設定
* Tailwind CSS
* レイアウト
* サイドバー
* ヘッダー
* 基本コンポーネント
* デザイントークン

## Step 2：ダミーデータと状態管理

* 型定義
* ダミーデータ
* Zustandストア
* Local Storage
* モックRepository

## Step 3：ダッシュボード

* アクションカード
* A・B・Cサマリー
* 要確認生徒
* 最近の記録
* 会議ショートカット
* 絞り込み遷移

## Step 4：生徒一覧・個表

* フィルター
* プリセット
* テーブル
* 生徒詳細
* タブ
* タイムライン
* 対応記録・アクション表示

## Step 5：アクション管理

* 一覧
* フィルター
* 作成モーダル
* 編集ドロワー
* ステータス更新
* 期限超過表示

## Step 6：スクリーニング準備

* 生徒切り替え
* タブ
* スコア入力
* 具体的事実入力
* 自動保存表示

## Step 7：会議画面

* スクリーニング会議
* 校内チーム会議
* 固定判定パネル
* 会議メモ
* クイックアクション作成

## Step 8：補助画面

* 地域資源
* 校内対応フラグ

## Step 9：仕上げ

* レスポンシブは不要
* アクセシビリティ
* 空状態
* ローディング
* テスト
* README

---

# 20. テスト要件

最低限、以下をテストする。

## ダッシュボード

* Aカードクリックで`direction=A`付きの生徒一覧へ遷移する
* 期限超過カードからアクション一覧へ遷移する

## 生徒一覧

* 学年フィルターが反映される
* プリセットが適用される
* 条件クリアで全件へ戻る
* 生徒行から個表へ遷移する

## アクション

* アクションを作成できる
* ステータスを変更できる
* 期限超過が表示される
* 必須項目未入力時にエラーが出る

## スクリーニング

* スコアを選択できる
* 具体的事実を入力できる
* 生徒を移動しても保存される
* 再読み込み後も入力内容が残る

---

# 21. 完了条件

以下をすべて満たした時点でフロントエンドモック完成とする。

* すべての主要ルートへ移動できる
* 主要画面がダミーデータで表示される
* ダッシュボードから絞り込み済み一覧へ遷移できる
* 生徒一覧のフィルターとプリセットが動作する
* 生徒個表で記録・アクション・会議を確認できる
* アクションを作成・編集・状態変更できる
* スクリーニング入力を仮保存できる
* 会議判定とメモを入力できる
* 地域資源とフラグ設定を表示できる
* ページ再読み込み後も編集内容が一定範囲で残る
* 実在する個人情報が含まれていない
* AI、録音、効果分析を実装していない
* 主要な画面に空状態とローディング状態がある
* デスクトップとタブレットでレイアウトが破綻しない
* `npm run lint`が成功する
* `npm run test`が成功する
* READMEに起動手順とモックの制約が記載されている