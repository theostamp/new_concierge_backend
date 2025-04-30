export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2">Ανακοινώσεις</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">3 νέες ανακοινώσεις</p>
        </div>
        <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2">Ενεργές Ψηφοφορίες</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">1 σε εξέλιξη</p>
        </div>
        <div className="p-4 rounded-xl shadow bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold mb-2">Αιτήματα</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">2 εκκρεμή</p>
        </div>
      </div>
    </div>
  );
}
