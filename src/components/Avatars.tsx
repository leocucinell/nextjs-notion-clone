"use client";
import { useOthers, useSelf } from "@liveblocks/react/suspense";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Avatars() {
  const others = useOthers();
  const self = useSelf();
  const all = [self, ...others];

  return (
    <div className="flex gap-2 items-center">
      <p className="font-light text-sm">Users currently editing this page</p>
      <div className="flex -space-x-5">
        <TooltipProvider>
          {all.map((user, i) => (
            <Tooltip key={user?.id + i}>
              <TooltipTrigger>
                <Avatar>
                  <AvatarImage
                    src={user?.info?.avatar}
                    className="border-2 hover:z-50"
                  />
                  <AvatarFallback>{user?.info?.name}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{self?.id === user?.id ? "You" : user?.info?.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
}
export default Avatars;
