export default function HomePage() {
  return (
    <main style={{ fontFamily: "Georgia, serif", padding: 32, maxWidth: 640 }}>
      <h1>Six Hops</h1>
      <p>Scaffold is up. SWE1 fills this page in S1-03.</p>
      <p>
        <a href="/post">Post a search</a>
        {" · "}
        <a href="/live">Live</a>
      </p>
    </main>
  );
}
