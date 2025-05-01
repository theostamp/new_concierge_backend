'use client';

import { useEffect, useState } from 'react';
import DashboardCards from '@/components/DashboardCards';
import ErrorMessage from '@/components/ErrorMessage';
import {
  fetchAnnouncements,
  fetchVotes,
  fetchRequests,
  fetchTopRequests,
  Announcement,
  Vote,
  UserRequest,
} from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';


export default function DashboardPage() {
  const { user } = useAuth();

  const [onlyMine, setOnlyMine] = useState(false);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [topRequests, setTopRequests] = useState<UserRequest[]>([]);
  const [obligations, setObligations] = useState<{
    pending_payments: number;
    maintenance_tickets: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadAll() {
      try {
        const [ann, vt, req] = await Promise.all([
          fetchAnnouncements(),
          fetchVotes(),
          fetchRequests(),
        ]);
        setAnnouncements(ann);
        setVotes(vt);
        setRequests(req);
        const top = await fetchTopRequests();
        setTopRequests(top);
        setError(false);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadAll();
  }, []);

  useEffect(() => {
    async function loadObligations() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/obligations/summary/`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to load obligations');
        const data = await res.json();
        setObligations(data);
      } catch (err) {
        console.error('Obligations error:', err);
      }
    }

    if (user?.is_staff) {
      loadObligations();
    }
  }, [user]);

  const filteredRequests =
    onlyMine && user
      ? requests.filter((r) => r.created_by_username === user.username)
      : requests;

  const requestCards = [
    {
      key: 'all',
      label: 'Όλα τα Αιτήματα',
      icon: '📨',
      bgColor: 'bg-blue-600',
      apiCondition: () => true,
      link: '/requests',
    },
    {
      key: 'open',
      label: 'Ανοιχτά',
      icon: '📂',
      bgColor: 'bg-orange-500',
      apiCondition: (r: UserRequest) => r.status === 'open',
      link: '/requests?status=open',
    },
    {
      key: 'urgent',
      label: 'Επείγοντα',
      icon: '🔥',
      bgColor: 'bg-red-600',
      apiCondition: (r: UserRequest) => r.is_urgent,
      link: '/requests?urgent=1',
    },
    {
      key: 'supported',
      label: 'Με Υποστήριξη',
      icon: '🤝',
      bgColor: 'bg-yellow-500',
      apiCondition: (r: UserRequest) => r.supporter_count > 0,
      link: '/requests?supported=1',
    },
  ];

  const activeVotes = votes.filter(
    (v) => new Date(v.end_date) > new Date()
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">📊 Πίνακας Ελέγχου</h1>

      {error && <ErrorMessage message="Αποτυχία φόρτωσης δεδομένων." />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/announcements" className="p-4 rounded-xl shadow bg-white dark:bg-gray-800 hover:shadow-md transition block">
          <h2 className="text-lg font-semibold mb-2">📢 Ανακοινώσεις</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{announcements.length} ανακοινώσεις</p>
        </Link>
        <Link href="/votes" className="p-4 rounded-xl shadow bg-white dark:bg-gray-800 hover:shadow-md transition block">
          <h2 className="text-lg font-semibold mb-2">🗳️ Ψηφοφορίες</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{activeVotes.length} ενεργές</p>
        </Link>
        <Link href="/requests" className="p-4 rounded-xl shadow bg-white dark:bg-gray-800 hover:shadow-md transition block">
          <h2 className="text-lg font-semibold mb-2">📨 Αιτήματα</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{requests.filter((r) => r.status === 'open').length} εκκρεμή</p>
        </Link>
      </div>

      {user?.is_staff && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/announcements/new" className="p-4 rounded-xl shadow bg-green-700 text-white hover:bg-green-800 transition block">
              📢 Δημιουργία Ανακοίνωσης
            </Link>
            <Link href="/votes/new" className="p-4 rounded-xl shadow bg-purple-700 text-white hover:bg-purple-800 transition block">
              🗳️ Νέα Ψηφοφορία
            </Link>
          </div>

          {obligations && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-2">🧾 Εκκρεμότητες Διαχείρισης</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-sm">
                  <p className="text-gray-500">Απλήρωτες Συνεισφορές</p>
                  <p className="text-2xl font-bold text-red-600">{obligations.pending_payments}</p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow text-sm">
                  <p className="text-gray-500">Εκκρεμείς Συντηρήσεις</p>
                  <p className="text-2xl font-bold text-yellow-600">{obligations.maintenance_tickets}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {user && (
        <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <input type="checkbox" checked={onlyMine} onChange={() => setOnlyMine(!onlyMine)} className="accent-blue-600" />
          <span>Μόνο δικά μου αιτήματα</span>
        </label>
      )}

      {!loading && !error && <DashboardCards data={filteredRequests} cards={requestCards} />}

      {filteredRequests.length > 0 && (
        <div className="mt-10 max-w-md">
          <h2 className="text-xl font-bold mb-4">📈 Κατανομή Αιτημάτων ανά Κατάσταση</h2>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={[
                    { name: 'Ανοιχτά', value: filteredRequests.filter((r) => r.status === 'open').length },
                    { name: 'Σε εξέλιξη', value: filteredRequests.filter((r) => r.status === 'in_progress').length },
                    { name: 'Ολοκληρωμένα', value: filteredRequests.filter((r) => r.status === 'resolved').length },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  <Cell fill="#f59e0b" />
                  <Cell fill="#3b82f6" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {topRequests.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">🏆 Top Υποστηριζόμενα Αιτήματα</h2>
          <ul className="space-y-2">
            {topRequests.map((r) => (
              <li key={r.id}>
                <Link href={`/requests/${r.id}`} className="block p-3 border rounded-lg shadow-sm hover:shadow transition bg-white">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-blue-800">{r.title}</h3>
                    <span className="text-sm text-gray-500">🤝 {r.supporter_count}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{r.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {announcements.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">📅 Πρόσφατες Ανακοινώσεις</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {announcements
              .toSorted((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
              .slice(0, 3)
              .map((a) => (
                <li key={a.id}>
                  <Link href={`/announcements`} className="block p-4 border rounded-lg shadow-sm hover:shadow transition bg-white dark:bg-gray-800">
                    <h3 className="font-semibold text-blue-900 dark:text-white mb-1 line-clamp-2">{a.title}</h3>
                    <p className="text-xs text-gray-500 mb-1">Έναρξη: {new Date(a.start_date).toLocaleDateString('el-GR')}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{a.description}</p>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      )}

      {!user && (
        <div className="text-center mt-10">
          <p className="text-sm text-gray-500">Είστε διαχειριστής ή ένοικος;</p>
          <Link
            href="/login"
            className="mt-2 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Σύνδεση
          </Link>
        </div>
      )}
  
            {user && (
              <div className="text-center mt-10">
                <p className="text-sm text-gray-500">Είστε διαχειριστής ή ένοικος;</p>
                <Link
                  href="/logout"
                  className="mt-2 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Αποσύνδεση
                </Link>
              </div>
            )}
            {loading && (
      <div className="text-center text-gray-500 mt-10">Φόρτωση...</div>
    )}
      
      

    </div>
  );
}
