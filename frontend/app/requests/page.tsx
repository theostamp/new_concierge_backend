// frontend/app/requests/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchRequests, UserRequest } from '@/lib/api';
import RequestCard from '@/components/RequestCard';
import ErrorMessage from '@/components/ErrorMessage';
import RequestSkeleton from '@/components/RequestSkeleton';
import DashboardCards from '@/components/DashboardCards';
import Link from 'next/link';

const STATUS_OPTIONS = [
  { value: '', label: 'Όλα' },
  { value: 'open', label: 'Ανοιχτά' },
  { value: 'in_progress', label: 'Σε εξέλιξη' },
  { value: 'resolved', label: 'Ολοκληρωμένα' },
];

export default function RequestsPage() {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [customFilter, setCustomFilter] = useState<'urgent' | 'supported' | ''>('');

  useEffect(() => {
    async function loadRequests() {
      try {
        const data = await fetchRequests(); // Φέρνουμε όλα τα requests
        setRequests(data);
        setError(false);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  const cardsConfig = [
    {
      key: 'all',
      label: 'Όλα τα Αιτήματα',
      icon: '📨',
      bgColor: 'bg-blue-600',
      link: '#',
      apiCondition: () => true,
      onClick: () => {
        setStatusFilter('');
        setCustomFilter('');
      },
    },
    {
      key: 'resolved',
      label: 'Ολοκληρωμένα',
      icon: '✅',
      bgColor: 'bg-green-600',
      apiCondition: (r: UserRequest) => r.status === 'resolved',
      onClick: () => {
        setStatusFilter('resolved');
        setCustomFilter('');
      },
    },
    {
      key: 'urgent',
      label: 'Επείγοντα',
      icon: '🔥',
      bgColor: 'bg-red-600',
      apiCondition: (r: UserRequest) => r.is_urgent === true,
      onClick: () => {
        setCustomFilter('urgent');
        setStatusFilter('');
      },
    },
    {
      key: 'supported',
      label: 'Με Υποστήριξη',
      icon: '🤝',
      bgColor: 'bg-yellow-500',
      apiCondition: (r: UserRequest) => r.supporter_count > 0,
      onClick: () => {
        setCustomFilter('supported');
        setStatusFilter('');
      },
    },
  ];

  const filteredRequests = requests.filter((r) => {
    if (customFilter === 'urgent') return r.is_urgent;
    if (customFilter === 'supported') return r.supporter_count > 0;
    if (statusFilter) return r.status === statusFilter;
    return true;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">📨 Αιτήματα Ενοίκων</h1>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCustomFilter('');
            }}
            className="border rounded px-3 py-2"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Link
            href="/requests/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Νέο Αίτημα
          </Link>
        </div>
      </div>

      {!loading && !error && (
        <DashboardCards data={requests} cards={cardsConfig} />
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <RequestSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorMessage message="Αδυναμία φόρτωσης αιτημάτων. Προσπαθήστε ξανά αργότερα." />
      ) : filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <RequestCard key={req.id} request={req} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Δεν υπάρχουν διαθέσιμα αιτήματα.</p>
      )}
    </div>
  );
}
