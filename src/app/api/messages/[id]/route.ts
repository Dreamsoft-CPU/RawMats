import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const messageId = params.id;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        sender: true,
      },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Transform the message for UI consumption
    const uiMessage = {
      ...message,
      sender: {
        id: message.sender.id,
        name: message.sender.displayName,
        image: message.sender.profilePicture,
      },
    };

    return NextResponse.json(uiMessage);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ error: true, message }, { status: 500 });
  }
}
