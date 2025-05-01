// frontend/app/requests/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ErrorMessage from '@/components/ErrorMessage';

// 👇 Αυτό θα αντικατασταθεί από real auth
const currentUser = { username: 'demo_user', is_staff: false };

interface UserRequest {
  id: number;
  title: string;
  description: string;
  status: string;
  created_by_username: string;
  supporter_count: number;
  supporter_usernames: string[];
  is_urgent: boolean;
  type?: string;
  created_at: string;
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString('el-GR', options);
}

export default function RequestDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<UserRequest | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [supporting, setSupporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = request?.created_by_username === currentUser.username || currentUser.is_staff;

  async function fetchRequest() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-requests/${id}/`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Αποτυχία φόρτωσης αιτήματος');
      const data = await res.json();
      setRequest(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSupport() {
    if (!request) return;
    setSupporting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user-requests/${request.id}/support/`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );
      if (!res.ok) throw new Error('Αποτυχία υποστήριξης');
      await fetchRequest();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSupporting(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Είστε σίγουρος ότι θέλετε να διαγράψετε το αίτημα;')) return;
    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-requests/${request?.id}/`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Αποτυχία διαγραφής');
      router.push('/requests');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    fetchRequest();
  }, [id]);

  if (loading) return <p className="p-6">Φόρτωση...</p>;
  if (error) return <ErrorMessage message={error} />;
  if (!request) return <p>Δεν βρέθηκε το αίτημα.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">{request.title}</h1>

      <p className="text-gray-800 whitespace-pre-wrap">{request.description}</p>

      <div className="text-sm text-gray-600">
        Υποβλήθηκε από: <strong>{request.created_by_username}</strong>
        <br />
        Ημερομηνία: <strong>{formatDate(request.created_at)}</strong>
        <br />
        Κατάσταση: <strong>{request.status}</strong>
        <br />
        Τύπος: <strong>{request.type ?? '—'}</strong>
        <br />
        Επείγον: <strong>{request.is_urgent ? 'Ναι' : 'Όχι'}</strong>
        <br />
        Υποστηρικτές: <strong>{request.supporter_count}</strong>
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleSupport}
          disabled={supporting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {supporting ? 'Επεξεργασία...' : 'Υποστηρίζω / Ανάκληση'}
        </button>

        {isOwner && (
          <>
            <button
              onClick={() => router.push(`/requests/${request.id}/edit`)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              ✏️ Επεξεργασία
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              🗑️ Διαγραφή
            </button>
          </>
        )}
      </div>

      {request.supporter_usernames.length > 0 && (
        <div className="mt-4 text-sm text-gray-700">
          Υποστηρικτές: {request.supporter_usernames.join(', ')}
        </div>
      )}
    </div>
  );
}
