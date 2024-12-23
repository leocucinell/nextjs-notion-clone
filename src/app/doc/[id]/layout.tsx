import { auth } from "@clerk/nextjs/server";
import RoomProviderWrapper from "@/components/RoomProvider";

function DocLayout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  auth.protect();

  return <RoomProviderWrapper roomId={id}>{children}</RoomProviderWrapper>;
}
export default DocLayout;
