"use client";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import NewDocumentButton from "./NewDocumentButton";
import { MenuIcon } from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { useUser } from "@clerk/nextjs";
import {
  collectionGroup,
  query,
  where,
  DocumentData,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import SidebarOption from "./SidebarOption";

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

function Sidebar() {
  const { user } = useUser();
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({ owner: [], editor: [] });
  const [data, loading, error] = useCollection(
    user &&
      query(
        collectionGroup(db, "rooms"),
        where("userId", "==", user?.emailAddresses[0].toString())
      )
  );

  useEffect(() => {
    // Group data by role
    if (!data) return;
    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, current) => {
        const roomData = current.data() as RoomDocument;
        if (roomData.role === "owner") {
          acc.owner.push({
            id: current.id,
            ...roomData,
          });
        } else {
          acc.editor.push({
            id: current.id,
            ...roomData,
          });
        }
        return acc;
      },
      { owner: [], editor: [] }
    );
    setGroupedData(grouped);
  }, [data]);

  const menuOptions = (
    <>
      <NewDocumentButton />

      {/* Owned documents */}
      <div className="flex py-4 flex-col space-y-4 md:max-w-34">
        {groupedData.owner.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm ">
            No documents found
          </h2>
        ) : (
          <>
            <h2 className="text-gray-500 font-semibold text-sm ">
              My documents
            </h2>
            {groupedData.owner.map((doc) => {
              // return <p key={doc.roomId}>{doc.roomId}</p>;
              return (
                <SidebarOption
                  key={doc.roomId}
                  id={doc.roomId}
                  href={`/doc/${doc.roomId}`}
                />
              );
            })}
          </>
        )}

        {/* Shared documents */}
        {groupedData.editor.length > 0 && (
          <div className="flex py-4 flex-col space-y-4 md:max-w-34">
            <h2 className="text-gray-500 font-semibold text-sm ">
              My documents
            </h2>
            {groupedData.editor.map((doc) => {
              // return <p key={doc.roomId}>{doc.roomId}</p>;
              return (
                <SidebarOption
                  key={doc.roomId}
                  id={doc.roomId}
                  href={`/doc/${doc.roomId}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      {/* Mobile sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon size={24} />
          </SheetTrigger>
          <SheetContent side="left" className="w-[400px] sm:w-[540px]">
            <SheetTitle>Menu</SheetTitle>
            {menuOptions}
          </SheetContent>
        </Sheet>
      </div>
      {/* md-lg sidebar */}
      <div className="hidden md:inline">{menuOptions}</div>
    </div>
  );
}
export default Sidebar;
