import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RawMats",
  description: "Browse and buy raw materials for your business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
      </body>
    </html>
  );
}
