"use client";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormEvent, useState, useTransition, useEffect } from "react";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import Avatars from "./Avatars";

function Document({ id }: { id: string }) {
  if (!id) return null;
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState<string>("");
  const [isUpdating, startTransition] = useTransition();
  const isOwner = useOwner();

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };

  return (
    <div className="flex-1 h-full bg-white p-5">
      <div className="flex max-w-6xl mx-auto justify-between pb-5">
        <form onSubmit={updateTitle} className="flex flex-1 space-x-2">
          {/* Update title */}
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <Button disabled={isUpdating} type="submit">
            {isUpdating ? "Updating..." : "Update"}
          </Button>

          {/* IF: isOwner of document */}
          {isOwner && (
            <>
              {/* Invite user */}
              <InviteUser />
              {/* Delete document */}
              <DeleteDocument />
            </>
          )}
          {/* Render: invite user flow */}
          {/* Render: Delete document button */}
        </form>
      </div>
      <div className="flex max-w-6xl mx-auto justify-between items-center">
        {/* Manage Users */}
        <ManageUsers />
        {/* Avatars */}
        <Avatars />
      </div>
      <hr className="pb-10" />
      {/* Collaberative Editor */}
      <Editor />
    </div>
  );
}
export default Document;
