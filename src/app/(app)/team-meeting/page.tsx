import { PageHeader } from "@/components/ui";
import { MeetingWorkspace } from "@/components/meetings/meeting-workspace";
import { repositories } from "@/repositories";
export default async function Page() {
  const [all, staff] = await Promise.all([
    repositories.students.getAll(),
    repositories.reference.getStaff(),
  ]);
  return (
    <>
      <PageHeader
        title="校内チーム会議"
        description="付議された生徒の具体的な支援方向とアクションを決定します。"
      />
      <MeetingWorkspace
        students={all.filter((s) => s.teamMeetingRequired)}
        staff={staff}
        mode="team"
      />
    </>
  );
}
