"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import useOwner from "@/lib/useOwner";
import { useRoom } from "@liveblocks/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { removeUserFromDocument } from "../../actions/actions";

function ManageUsers() {
  const [isOpen, setIsOpen] = useState(false);
  const isOwner = useOwner();
  const room = useRoom();
  const [isPending, startTransition] = useTransition();
  const { user } = useUser();

  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  const handleDelete = (userId: string) => {
    startTransition(async () => {
      // Delete user from the room
      if (!user) return;
      const result = await removeUserFromDocument(room.id, userId);
      if (result?.success) {
        toast.success("User removed successfully!");
      } else {
        toast.error("Failed to remove user from room...");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild onClick={() => setIsOpen(!isOpen)} variant="outline">
        <DialogTrigger>Users ({usersInRoom?.docs.length})</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Users with access</DialogTitle>
          <DialogDescription>
            Below is a list of users who have access to this document.
          </DialogDescription>
        </DialogHeader>
        <hr className="my-2" />
        <div className="flex flex-col space-y-2">
          {/* Map through users in the room */}
          {usersInRoom?.docs.map((doc) => {
            return (
              <div
                className="flex items-center justify-between"
                key={doc.data()?.userId}
              >
                <p className="font-light">
                  {doc.data()?.userId === user?.emailAddresses[0].toString()
                    ? `You (${doc.data()?.userId})`
                    : doc.data()?.userId}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline">{doc.data().role}</Button>
                  {isOwner &&
                    doc.data().userId !==
                      user?.emailAddresses[0].toString() && (
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(doc.data().userId)}
                        disabled={isPending}
                        size="sm"
                      >
                        {isPending ? "Removing" : "X"}
                      </Button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default ManageUsers;
