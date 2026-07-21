import { PageHeader } from "@/components/ui";
import { ResourceMap } from "@/components/resources/resource-map";
import { repositories } from "@/repositories";
export default async function Page() {
  const r = await repositories.reference.getResources();
  return (
    <>
      <PageHeader
        title="地域資源"
        description="学校周辺の架空の地域資源を確認します。地図は静的なデモ表示です。"
      />
      <ResourceMap resources={r} />
    </>
  );
}
