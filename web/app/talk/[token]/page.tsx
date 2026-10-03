import type { Metadata } from "next";
import TalkClient from "./talk-client";

export const metadata: Metadata = {
  title: "Talk · Six Hops",
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export default async function TalkPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <TalkClient token={token} />;
}
