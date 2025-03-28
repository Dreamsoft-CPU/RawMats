import prisma from "@/utils/prisma";
import { getDbUser } from "@/utils/server/getDbUser";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { receiverId } = await request.json();
    const user = await getDbUser();

    if ("error" in user && user.error) {
      throw new Error(user.message);
    }

    if (!("error" in user)) {
      const conversation = await prisma.conversation.create({
        data: {
          members: {
            create: [{ userId: user.id }, { userId: receiverId }],
          },
        },
      });

      return NextResponse.json({ conversation }, { status: 201 });
    }
  } catch (e) {
    console.log(e);
    const message = e instanceof Error ? e.message : "An error occurred";
    return new Response(JSON.stringify({ error: true, message }), {
      status: 400,
    });
  }
};
