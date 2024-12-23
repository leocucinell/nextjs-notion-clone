import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import liveblocks from "@/lib/liveblocks";
import { adminDb } from "../../../firebase-admin";
import { stat } from "fs";

export async function POST(req: NextRequest) {
  auth.protect();
  const { sessionClaims } = await auth();
  const { room } = await req.json();

  const session = liveblocks.prepareSession(sessionClaims?.email! as string, {
    userInfo: {
      name: sessionClaims?.fullName! as string,
      email: sessionClaims?.email! as string,
      avatar: sessionClaims?.image! as string,
    },
  });

  const usersInRoom = await adminDb
    .collectionGroup("rooms")
    .where("userId", "==", sessionClaims?.email)
    .get();

  const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

  if (userInRoom?.exists) {
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();

    return new Response(body, { status });
  } else {
    return NextResponse.json(
      { message: "you are not in this room" },
      { status: 403 }
    );
  }
}
