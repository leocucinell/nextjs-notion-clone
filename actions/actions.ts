"use server";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../firebase-admin";

export async function createNewDocument() {
  // Retrieve the session and ensure the user is authenticated
  auth.protect();
  const { sessionClaims } = await auth();

  // Create a document in firestore
  const docCollectionRefference = adminDb.collection("documents");
  const docRef = await docCollectionRefference.add({
    title: "New Document",
  });

  // add the reference to the document for the user
  await adminDb
    .collection("users")
    .doc(sessionClaims?.email as string)
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: sessionClaims?.email!,
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });

  return { docId: docRef.id };
}
