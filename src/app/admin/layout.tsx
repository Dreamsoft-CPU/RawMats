import prisma from "@/utils/prisma";
import { getUserData } from "@/utils/server/getUserData";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserData();

  if ("error" in user) {
    return <section>{user.message}</section>;
  }

  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
    },
    include: {
      Supplier: true,
    },
  });

  if (userData.role !== "ADMIN") {
    redirect("/");
  }

  return <section>{children}</section>;
}
