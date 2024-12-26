"use server";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../firebase-admin";
import liveblocks from "@/lib/liveblocks";

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

export async function deleteDocument(roomId: string) {
  // retrieve the session and ensure the user is authenticated
  auth.protect();
  console.log("deleteDocument", roomId);

  try {
    // Find the document in firestore and delete it
    await adminDb.collection("documents").doc(roomId).delete();

    // find the reference in the user collection and delete it
    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();
    // we have now found ALL of the places that the documentID (and room id) is refferenced within the room collection

    // make a batch command to delete all of the references
    const batch = adminDb.batch();
    // loop through each document in the rooms collection and delete it
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit(); // execute the batch command

    // now we need to delete the liveblocks room
    await liveblocks.deleteRoom(roomId);

    //return true
    return { success: true };
  } catch (error) {
    console.log(error);
  }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  // retrieve session and make sure the user is authenticated
  auth.protect();

  try {
    // find the user within the users collection
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId,
      });

    return { success: true };
  } catch (error) {
    console.log("ERROR", error);
    return { success: false };
  }
}

export async function removeUserFromDocument(roomId: string, userId: string) {
  // retrieve session and make sure the user is authenticated
  auth.protect();

  try {
    // find the user within the users collection and delete the document from their rooms collection
    await adminDb
      .collection("users")
      .doc(userId)
      .collection("rooms")
      .doc(roomId)
      .delete();

    return { success: true };
  } catch (error) {
    console.log("ERROR", error);
    return { success: false };
  }
}
