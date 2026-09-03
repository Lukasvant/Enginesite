export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-900 p-8">
      <h1 className="text-4xl md:text-5xl font-semibold mb-4 text-center">Jubileum Engine</h1>
      <p className="text-lg text-stone-600 max-w-xl text-center mb-8">
        Door Ambachtio — verleden ontdekken, verhalen maken, jubilea vieren.
      </p>
      <a
        href="/login"
        className="bg-stone-900 text-white px-6 py-3 rounded font-medium hover:bg-stone-800 transition"
      >
        Ga naar admin
      </a>
    </main>
  );
}
