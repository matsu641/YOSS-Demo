import { PageHeader } from "@/components/ui";
import { MeetingWorkspace } from "@/components/meetings/meeting-workspace";
import { repositories } from "@/repositories";
export default async function Page() {
  const [s, staff] = await Promise.all([
    repositories.students.getAll(),
    repositories.reference.getStaff(),
  ]);
  return (
    <>
      <PageHeader
        title="スクリーニング会議"
        description="事前情報を確認し、校内チーム会議への付議と暫定支援方向を決定します。"
      />
      <MeetingWorkspace students={s} staff={staff} mode="screening" />
    </>
  );
}
