import { auth } from "@clerk/nextjs/server";
import RoomProviderWrapper from "@/components/RoomProvider";

async function DocLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>; // Adjust the type
}) {
  await auth.protect(); // Protect route

  // Await params since it's a Promise
  const { id } = await params;

  return <RoomProviderWrapper roomId={id}>{children}</RoomProviderWrapper>;
}

export default DocLayout;
