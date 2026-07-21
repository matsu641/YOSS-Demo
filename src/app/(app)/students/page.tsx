import { PageHeader, Button } from "@/components/ui";
import { StudentList } from "@/components/students/student-list";
import { repositories } from "@/repositories";
export default async function Page() {
  const [students, staff, screenings, flags, records] = await Promise.all([
    repositories.students.getAll(),
    repositories.reference.getStaff(),
    repositories.reference.getScreenings(),
    repositories.reference.getFlags(),
    repositories.records.getAll(),
  ]);
  return (
    <>
      <PageHeader
        title="生徒一覧"
        description="児童生徒の支援状況、アクション、スクリーニング結果を確認します。"
        actions={
          <>
            <Button>対応記録を追加</Button>
            <Button variant="outline">アクションを追加</Button>
          </>
        }
      />
      <StudentList
        students={students}
        staff={staff}
        screenings={screenings}
        flags={flags}
        records={records}
      />
    </>
  );
}
