import type { Metadata } from "next";
import HolderPage from "./holder-page";

export const metadata: Metadata = {
  title: "Your next hop · Six Hops",
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <HolderPage key={token} />;
}
