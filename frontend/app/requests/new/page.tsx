// C:\Users\Notebook\new_concierge\frontend\app\requests\new\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ErrorMessage from '@/components/ErrorMessage';
import { createUserRequest } from '@/lib/api';      // ✅ helper που στέλνει CSRF

const LOCAL_STORAGE_KEY = 'new_request_draft';

export default function NewRequestPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requestType, setRequestType] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  /* 🔄 Φόρτωση πρόχειρων δεδομένων */
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setTitle(data.title ?? '');
        setDescription(data.description ?? '');
      } catch {
        /* ignore */
      }
    }
  }, []);

  /* 💾 Αυτόματη αποθήκευση */
  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ title, description })
    );
  }, [title, description]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!title.trim()) {
      setError('Ο τίτλος δεν μπορεί να είναι κενός.');
      setSubmitting(false);
      return;
    }

    try {
      await createUserRequest({
        title: title.trim(),
        description,
        type: requestType || undefined,
        is_urgent: isUrgent,
      });

      localStorage.removeItem(LOCAL_STORAGE_KEY);
      router.push('/requests');
    } catch (err) {
      setError((err as Error).message ?? 'Αποτυχία υποβολής αιτήματος');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">➕ Νέο Αίτημα</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Τίτλος
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="desc" className="block text-sm font-medium">
            Περιγραφή
          </label>
          <textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2 h-32"
            required
          />
        </div>

        <div>
          <label htmlFor="rtype" className="block text-sm font-medium">
            Τύπος Αιτήματος
          </label>
          <select
            id="rtype"
            value={requestType}
            onChange={(e) => setRequestType(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          >
            <option value="">-- Επιλέξτε τύπο --</option>
            <option value="maintenance">Συντήρηση</option>
            <option value="cleaning">Καθαριότητα</option>
            <option value="technical">Τεχνικό</option>
            <option value="other">Άλλο</option>
          </select>
        </div>

        <div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="accent-red-600"
            />Επείγον αίτημα
          </label>
        </div>

        {error && <ErrorMessage message={error} />}

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Υποβολή
        </button>
      </form>

      {/* 🔎 Προεπισκόπηση */}
      <div className="mt-8 border-t pt-4 text-sm text-gray-700">
        <h2 className="text-lg font-semibold mb-2">Προεπισκόπηση:</h2>
        <p>
          <strong>Τίτλος:</strong> {title || '—'}
        </p>
        <p>
          <strong>Περιγραφή:</strong> {description || '—'}
        </p>
        <p>
          <strong>Τύπος:</strong> {requestType || '—'}
        </p>
        <p>
          <strong>Επείγον:</strong> {isUrgent ? 'Ναι' : 'Όχι'}
        </p>
      </div>
    </div>
  );
}
