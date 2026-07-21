import { notFound } from "next/navigation";
import { StudentDetail } from "@/components/students/student-detail";
import { repositories } from "@/repositories";
export default async function Page({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const [student, students, staff, screenings, meetings] = await Promise.all([
    repositories.students.getById(studentId),
    repositories.students.getAll(),
    repositories.reference.getStaff(),
    repositories.reference.getScreenings(studentId),
    repositories.reference.getMeetings(studentId),
  ]);
  if (!student) notFound();
  return (
    <StudentDetail
      student={student}
      index={students.findIndex((s) => s.id === student.id)}
      total={students.length}
      staff={staff}
      screenings={screenings}
      meetings={meetings}
    />
  );
}
