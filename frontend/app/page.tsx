export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-4">Καλώς ήρθατε στον Ψηφιακό Θυρωρό</h1>
      <p className="text-lg mb-6">
        Ξεκινήστε διαμορφώνοντας το περιβάλλον σας ή επιλέξτε από το μενού αριστερά.
      </p>
      <div className="flex gap-4">
        <a
          href="/dashboard"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Μετάβαση στο Dashboard
        </a>
        <a
          href="https://nextjs.org/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-200 dark:bg-gray-800 px-6 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
        >
          Τεκμηρίωση Next.js
        </a>
      </div>
    </div>
  );
}
