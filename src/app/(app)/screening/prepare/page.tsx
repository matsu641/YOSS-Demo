import { PageHeader } from "@/components/ui";
import { Preparation } from "@/components/screening/preparation";
import { repositories } from "@/repositories";
export default async function Page() {
  const [students, definitions] = await Promise.all([
    repositories.students.getAll(),
    repositories.reference.getScreeningDefinitions(),
  ]);
  return (
    <>
      <PageHeader
        title="スクリーニング会議の準備"
        description="担当領域の情報を入力し、会議前に共有可能な状態を作ります。"
      />
      <Preparation students={students} definitions={definitions} />
    </>
  );
}
