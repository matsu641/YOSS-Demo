"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  Bell,
  CalendarCheck,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Database,
  FileCheck2,
  FileOutput,
  HeartPulse,
  LayoutDashboard,
  Menu,
  RefreshCw,
  UserRoundPlus,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal, Button, ToastViewport } from "@/components/ui";
import { useUiStore } from "@/stores";
const nav = [
  [/dashboard/, "/dashboard", "ダッシュボード", LayoutDashboard],
  [/students/, "/students", "生徒一覧", Users],
] as const;
const meetingChildren = [
  ["/screening/prepare", "スクリーニング準備"],
  ["/screening/meeting", "スクリーニング会議"],
  ["/team-meeting", "校内チーム会議"],
] as const;
const displayOnlyNav = [
  ["初期設定フロー", FileCheck2],
  ["転入フロー", UserRoundPlus],
  ["年次更新フロー", RefreshCw],
] as const;
const displayOnlyDataNav = [
  ["データ設定", Database],
  ["データ出力", FileOutput],
] as const;
export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname(),
    open = useUiStore((s) => s.sidebarOpen),
    toggle = useUiStore((s) => s.toggleSidebar),
    reset = useUiStore((s) => s.reset);
  const [confirm, setConfirm] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isMeetingPath = /meetings|screening|team-meeting/.test(path);
  const [meetingOpen, setMeetingOpen] = useState(isMeetingPath);
  const currentMeeting = meetingChildren.find(([href]) => path === href);
  return (
    <div className={cn("app-layout", collapsed && "sidebar-collapsed")}>
      <aside className={cn("sidebar", open && "mobile-open")}>
        <div className="brand">
          <div className="brand-logo-frame">
            <Image
              className="brand-logo"
              src="/logo.png"
              width={784}
              height={248}
              priority
              alt="YOSS Cloud Services"
            />
          </div>
          <button
            type="button"
            className="sidebar-collapse"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={
              collapsed ? "サイドバーを展開" : "サイドバーを折りたたむ"
            }
            title={collapsed ? "サイドバーを展開" : "サイドバーを折りたたむ"}
          >
            {collapsed ? <ChevronsRight /> : <ChevronsLeft />}
          </button>
          <button className="mobile-close" onClick={toggle} aria-label="閉じる">
            <X />
          </button>
        </div>
        <nav aria-label="メインメニュー">
          {nav.map(([match, href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn("nav-item", match.test(path) && "active")}
            >
              <Icon />
              <span>{label}</span>
            </Link>
          ))}
          <button
            type="button"
            className={cn("nav-item nav-parent", isMeetingPath && "active")}
            aria-expanded={meetingOpen}
            title={collapsed ? "会議の準備・実施" : undefined}
            onClick={() => {
              if (collapsed) setCollapsed(false);
              setMeetingOpen((value) => !value);
            }}
          >
            <CalendarCheck />
            <span>会議の準備・実施</span>
            <ChevronRight
              className={cn("nav-parent-chevron", meetingOpen && "open")}
            />
          </button>
          {meetingOpen && (
            <div className="nav-submenu">
              {meetingChildren.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className={cn("nav-subitem", path === href && "active")}
                  onClick={() => open && toggle()}
                >
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          )}
          <Link
            href="/support-effects"
            title={collapsed ? "支援状況・変化" : undefined}
            className={cn(
              "nav-item",
              path === "/support-effects" && "active",
            )}
            onClick={() => open && toggle()}
          >
            <HeartPulse />
            <span>支援状況・変化</span>
          </Link>
          <div className="nav-divider" />
          {displayOnlyNav.map(([label, Icon]) => (
            <button
              key={label}
              type="button"
              className="nav-item nav-item-display-only"
              disabled
              aria-label={`${label}（今回は表示のみ）`}
              title="今回は表示のみです"
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
          <div className="nav-divider" />
          {displayOnlyDataNav.map(([label, Icon]) => (
            <button
              key={label}
              type="button"
              className="nav-item nav-item-display-only"
              disabled
              aria-label={`${label}（今回は表示のみ）`}
              title="今回は表示のみです"
            >
              <Icon />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
      {open && (
        <button
          className="sidebar-backdrop"
          onClick={toggle}
          aria-label="閉じる"
        />
      )}
      <div className="workspace">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={toggle}
            aria-label="メニュー"
          >
            <Menu />
          </button>
          {currentMeeting && (
            <nav className="topbar-breadcrumb" aria-label="パンくず">
              <Link href="/meetings">会議の準備・実施</Link>
              <ChevronRight aria-hidden="true" />
              <span aria-current="page">{currentMeeting[1]}</span>
            </nav>
          )}
          {path === "/actions" && (
            <nav className="topbar-breadcrumb" aria-label="パンくず">
              <Link href="/dashboard">ダッシュボード</Link>
              <ChevronRight aria-hidden="true" />
              <span aria-current="page">アクション一覧</span>
            </nav>
          )}
          <div className="topbar-spacer" />
          <div className="school">
            <b>YOSSデモ小学校</b>
            <span>2026年度</span>
          </div>
          <button className="icon-button" aria-label="通知3件">
            <Bell />
          </button>
          <button className="profile" onClick={() => setConfirm(true)}>
            <span className="avatar">山</span>
            <span>山田 管理職</span>
          </button>
        </header>
        <main className="main-content">{children}</main>
      </div>
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="デモデータを初期化しますか？"
      >
        <p>作成・編集した仮保存データが削除されます。</p>
        <div className="form-actions">
          <Button variant="outline" onClick={() => setConfirm(false)}>
            キャンセル
          </Button>
          <Button variant="danger" onClick={reset}>
            初期化する
          </Button>
        </div>
      </Modal>
      <ToastViewport />
    </div>
  );
}
