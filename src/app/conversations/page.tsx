import React from "react";
import ConversationCard from "@/components/conversations/ConversationCard";
import HomeSidebar from "@/components/home/HomeSidebar";
import HomeInset from "@/components/sidebar/insets/HomeInset";
import prisma from "@/utils/prisma";
import { getDbUser } from "@/utils/server/getDbUser";
import { getSidebarData } from "@/utils/server/getSidebarData";
import {
  mapPrismaConversationToUi,
  UiConversation,
} from "@/lib/types/conversations.type";
import {
  Conversation,
  ConversationMembers,
  Message,
  User,
} from "@prisma/client";

const Conversations = async () => {
  const sidebarData = await getSidebarData();
  const user = await getDbUser();

  if ("error" in user) {
    throw new Error(user.message);
  }

  // Define the complex Prisma return type
  type PrismaConversation = Conversation & {
    messages: (Message & { sender: User })[];
    members: (ConversationMembers & { user: User })[];
  };

  const initialConversations = (await prisma.conversation.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        take: 20,
        include: {
          sender: true,
        },
      },
      members: {
        include: {
          user: true,
        },
      },
    },
  })) as PrismaConversation[];

  // Map Prisma types to UI types using our utility function
  const mappedConversations: UiConversation[] = initialConversations.map(
    mapPrismaConversationToUi,
  );

  return (
    <div className="flex h-screen w-full">
      <HomeSidebar data={sidebarData} />
      <HomeInset userData={user}>
        <ConversationCard
          userId={user.id}
          initialConversations={mappedConversations}
        />
      </HomeInset>
    </div>
  );
};

export default Conversations;
