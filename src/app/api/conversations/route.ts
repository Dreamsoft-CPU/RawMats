import prisma from "@/utils/prisma";
import { getDbUser } from "@/utils/server/getDbUser";
import { NextResponse } from "next/server";
import { z } from "zod";

const conversationSchema = z.object({
  receiverId: z.string().min(1),
});

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { receiverId } = conversationSchema.parse(body);

    const user = await getDbUser();
    if ("error" in user) {
      return NextResponse.json(
        { error: true, message: user.message },
        { status: 401 },
      );
    }

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            members: {
              some: {
                userId: user.id,
              },
            },
          },
          {
            members: {
              some: {
                userId: receiverId,
              },
            },
          },
        ],
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (existingConversation) {
      return NextResponse.json(
        { conversation: existingConversation },
        { status: 200 },
      );
    }

    const [conversation, sender] = await Promise.all([
      prisma.conversation.create({
        data: {
          members: {
            create: [{ userId: user.id }, { userId: receiverId }],
          },
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      }),
      prisma.user.findUnique({
        where: { id: user.id },
        select: { displayName: true },
      }),
    ]);

    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: "New Conversation",
        content: `${sender?.displayName} started a conversation with you`,
      },
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 400 });
  }
};
