import { PageHeader } from "@/components/ui";
import { FlagManager } from "@/components/flags/flag-manager";
export default function Page() {
  return (
    <>
      <PageHeader
        title="校内対応フラグ設定"
        description="学校独自の分類ラベルを追加・編集・非表示にできます。"
      />
      <FlagManager />
    </>
  );
}
