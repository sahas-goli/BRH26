import type { Metadata } from "next";
import ClaimPage from "./claim-page";

export const metadata: Metadata = {
  title: "Make the introduction · Six Hops",
  referrer: "no-referrer",
  robots: { index: false, follow: false },
};

export default async function Page({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <ClaimPage key={token} />;
}
