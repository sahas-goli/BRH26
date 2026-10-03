import type { Metadata } from "next";
import { getHolderShareMeta } from "../../../lib/bounty";
import { ensureBountyDatabase } from "../../../lib/ensure-db";
import HolderPage from "./holder-page";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await ensureBountyDatabase();
    const { token } = await params;
    const meta = await getHolderShareMeta(token);
    return {
      title: meta.title,
      description: meta.description,
      referrer: "no-referrer",
      robots: { index: false, follow: false },
      openGraph: {
        title: meta.title,
        description: meta.description,
        images: [{ url: meta.ogImageUrl, width: 1200, height: 630, alt: "Wanted card" }],
      },
      twitter: {
        card: "summary_large_image",
        title: meta.title,
        description: meta.description,
        images: [meta.ogImageUrl],
      },
    };
  } catch {
    return {
      title: "Your next hop · Six Hops",
      referrer: "no-referrer",
      robots: { index: false, follow: false },
    };
  }
}

export default async function Page({ params }: Props) {
  const { token } = await params;
  return <HolderPage key={token} />;
}
