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

function Sidebar() {
  const menuOptions = (
    <>
      <NewDocumentButton />

      {/* My documents */}
      {/* ... */}

      {/* Shared with me */}
      {/* ... */}
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
