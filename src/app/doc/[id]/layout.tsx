import { auth } from "@clerk/nextjs/server";
import RoomProviderWrapper from "@/components/RoomProvider";

async function DocLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  await auth.protect();
  const { id } = await params;

  return <RoomProviderWrapper roomId={id}>{children}</RoomProviderWrapper>;
}

export default DocLayout;
