import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { z } from "zod";

const MessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  conversationId: z.string(),
  userId: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const result = MessageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 },
      );
    }

    const { message, conversationId, userId } = result.data;

    // Check if the user is part of the conversation
    const membership = await prisma.conversationMembers.findFirst({
      where: {
        conversationId,
        userId,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "User is not part of this conversation" },
        { status: 403 },
      );
    }

    // Get the conversation members to find the recipient
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    // Find the recipient (the other member of the conversation)
    const recipient = conversation.members.find(
      (member) => member.userId !== userId,
    );

    if (!recipient) {
      return NextResponse.json(
        { error: "Recipient not found" },
        { status: 404 },
      );
    }

    // Create the new message
    const newMessage = await prisma.message.create({
      data: {
        content: message,
        conversationId,
        senderId: userId,
      },
      include: {
        sender: true,
      },
    });

    // Update the conversation's updatedAt timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Create notification only for the recipient (not the sender)
    if (recipient.userId !== userId) {
      await prisma.notification.create({
        data: {
          userId: recipient.userId,
          title: "New Message",
          content: `You have a new message from ${newMessage.sender.displayName}`,
        },
      });
    }

    // Transform the message for the response
    const responseMessage = {
      ...newMessage,
      sender: {
        id: newMessage.sender.id,
        name: newMessage.sender.displayName,
        image: newMessage.sender.profilePicture,
      },
    };

    return NextResponse.json(responseMessage);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 500 });
  }
}
