import { render,screen } from "@testing-library/react";
import { describe,expect,it } from "vitest";
import DashboardPage from "@/app/(app)/dashboard/page";
import { repositories } from "@/repositories";
import { DirectionBadge,StatusBadge } from "@/components/ui";
import { useScreeningStore } from "@/stores";

describe("ダッシュボード",()=>{it("絞り込みクエリ付きの導線を表示する",async()=>{render(await DashboardPage());expect(screen.getByRole("link",{name:/期限超過/})).toHaveAttribute("href","/actions?status=overdue");expect(screen.getByRole("link",{name:/A 教職員関与/})).toHaveAttribute("href","/students?direction=A")})});
describe("生徒Repository",()=>{it("学年と支援方向を絞り込む",async()=>{const result=await repositories.students.getAll({grade:2,direction:"A"});expect(result.length).toBeGreaterThan(0);expect(result.every(s=>s.grade===2&&s.supportDirections.includes("A"))).toBe(true)});it("条件なしで36名を返す",async()=>{expect(await repositories.students.getAll()).toHaveLength(36)})});
describe("状態表示",()=>{it("色だけでなく日本語ラベルを表示する",()=>{render(<><DirectionBadge direction="B"/><StatusBadge status="in-progress"/><StatusBadge status="not-started" overdue/></>);expect(screen.getByText("B 地域資源")).toBeInTheDocument();expect(screen.getByText("対応中")).toBeInTheDocument();expect(screen.getByText("期限超過")).toBeInTheDocument()})});
describe("スクリーニング保存",()=>{it("生徒ごとの入力をストアへ反映する",()=>{useScreeningStore.getState().saveResponse("student-1",{itemId:"item-1",score:2,observedFact:"確認した事実",informationSource:"direct-observation",verificationStatus:"verified",note:""});const session=useScreeningStore.getState().sessions.find(s=>s.studentId==="student-1");expect(session?.responses.find(r=>r.itemId==="item-1")?.observedFact).toBe("確認した事実")})});
