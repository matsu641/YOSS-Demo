import { PageHeader } from "@/components/ui";
import { ActionManager } from "@/components/actions/action-manager";
import { repositories } from "@/repositories";
export default async function Page() {
  const [students, staff] = await Promise.all([
    repositories.students.getAll(),
    repositories.reference.getStaff(),
  ]);
  return (
    <>
      <PageHeader
        title="アクション一覧"
        description="支援内容の担当者、期限、進行状況を管理します。"
      />
      <ActionManager students={students} staff={staff} />
    </>
  );
}
