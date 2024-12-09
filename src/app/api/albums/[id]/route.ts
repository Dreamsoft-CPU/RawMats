import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma/client";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> => {
  // This is for editing album names and adding content
  try {
    const id = (await params).id;

    const album = await prisma.album.findUnique({
      where: {
        id: id,
      },
    });

    console.log(album);

    const { method } = await request.json();

    if (method === "ADD") {
      // If the user wants to add a new method
      // You get the form data from the request.json();
    } else if (method === "EDIT") {
      // If the user wants to edit album name
      // You get the form data from the request.json();
    } else {
      throw new Error("Invalid method!");
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 400 });
  }
};
