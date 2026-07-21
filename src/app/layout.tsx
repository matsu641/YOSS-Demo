import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "YOSS Cloud | デモ",
  description: "学校支援情報フロントエンドモック",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
