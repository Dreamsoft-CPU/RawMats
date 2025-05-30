import { Roboto } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RawMats",
  description: "Raw Materials Management Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.className} w-full h-screen`}>
        <SidebarProvider>{children}</SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
