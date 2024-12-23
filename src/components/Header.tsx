"use client";

import {
  useUser,
  SignedOut,
  SignedIn,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Breadcrumbs from "./Breadcrumbs";

function Header() {
  const { user } = useUser();
  return (
    <div className="flex flex-row justify-between px-5 py-3">
      {/* User Title */}
      {user && (
        <div>
          <div>
            {user?.firstName}
            {`'s`} Space
          </div>
        </div>
      )}
      {/* Breadcrumbs */}
      <Breadcrumbs />
      {/* Clerk Items */}
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
export default Header;
