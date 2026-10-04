import type { Metadata } from "next";
import styles from "../post/pages.module.css";

export const metadata: Metadata = {
  title: "How it works · Six Hops",
  description: "How a Six Hops search finds a person and pays the people who passed the link.",
};

const example = [
  ["Match is first", "Match\u00A0$16"],
  ["One passer, then the match", "Passer\u00A0$7, match\u00A0$9"],
  ["Two passers, then the match", "First\u00A0$1, last passer\u00A0$6, match\u00A0$9"],
  ["Eight people", "Six early passers\u00A0$1, last passer\u00A0$1, match\u00A0$9"],
] as const;

export default function AboutPage() {
  return (
    <main className={styles.shell}>
      <div className={styles.content}>
        <nav className={styles.nav} aria-label="Main navigation">
          <a href="/">SIX HOPS</a>
          <span className={styles.navLinks}>
            <a href="/about" aria-current="page">How it works</a>
            <a href="/live">Watch the search ↗</a>
          </span>
        </nav>
        <p className={styles.eyebrow}>How it works</p>
        <h1 className={styles.title}>Pass a link. Pay the route.</h1>
        <p className={styles.intro}>
          Someone describes a kind of person, with no name and no street address. They fund a reward. A friend gets one personal link. That friend taps This is me, or passes the link to someone closer.
        </p>
        <p className={styles.intro}>
          Each person can pass the link up to three times. A chain is at most eight hops. The person who matches writes a short introduction. The creator accepts, and then one Solana devnet transaction pays the route. The creator is not paid.
        </p>
        <p className={styles.intro}>
          The reward, B, is the Photon deposit minus a 0.001 SOL reserve, priced at $150 per SOL. A search made on the website is 60% of the cap. The other 40% goes back to the creator.
        </p>
        <p className={styles.intro}>
          The poster is unpaid. h is the number of paid people after the poster. When h is 1, the match gets all of B. When h is 2 or more, the match&apos;s share is reserved at B - 7*floor(B/16) and does not shrink as the chain grows. Every passer except the last gets floor(B/16). The last passer, who handed the link to the match, gets what is left. Shares sum to B. Chains longer than 8 pay nobody.
        </p>
        <section className={styles.card} aria-labelledby="sixteen">
          <h2 id="sixteen">A $16 reward</h2>
          <table className={styles.split}>
            <thead>
              <tr>
                <th scope="col">Chain</th>
                <th scope="col">Paid</th>
              </tr>
            </thead>
            <tbody>
              {example.map(([chain, paid]) => (
                <tr key={chain}>
                  <td>{chain}</td>
                  <td>{paid}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.muted}>
            <a href="/example">See Poster, Riley, Sam, and Alex.</a>
          </p>
        </section>
        <p className={styles.intro}>
          A new hop moves money from the last passer to the new last passer. The match&apos;s reserved share stays put once anyone has passed the link.
        </p>
        <p className={styles.muted}>
          Payouts are devnet SOL. Nessie figures on the site are demo balances. The creator&apos;s private page shows who has the link, without names.
        </p>
        <div className={styles.actions}>
          <a className={styles.button} href="/post">Start a search</a>
        </div>
      </div>
    </main>
  );
}
