"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { UserPlus2 } from "lucide-react";
import { FormEvent, useState, useTransition } from "react";
import { DialogClose } from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { inviteUserToDocument } from "../../actions/actions";
import { toast } from "sonner";

function InviteUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const path = usePathname();
  const router = useRouter();

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();

    const roomId = path.split("/").pop();
    if (!roomId) return;

    startTransition(async () => {
      const result = await inviteUserToDocument(roomId, email);
      if (result?.success) {
        setIsOpen(false);
        setEmail("");
        toast.success("User invited to room successfully!");
      } else {
        toast.error("Failed to invite user to room...");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild onClick={() => setIsOpen(!isOpen)} variant="outline">
        <DialogTrigger>
          <UserPlus2 size={24} />
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a user to collaborate!</DialogTitle>
          <DialogDescription>
            Enter the email of the user you want to invite.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleInvite}
          className="flex flex-col md:flex-row gap-2"
        >
          <Input
            type="email"
            placeholder="name@mail.com"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" disabled={!email || isPending}>
            {isPending ? "Inviting..." : "Invite"}
          </Button>
        </form>
        {/* <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
export default InviteUser;
