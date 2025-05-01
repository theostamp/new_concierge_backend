// components/CreateRequestForm.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserRequest } from '@/lib/api';   // ✅

export default function CreateRequestForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('open');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createUserRequest({ title, description, priority, status });
      router.push('/requests');


    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Άγνωστο σφάλμα');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 space-y-4">
      <h1 className="text-xl font-bold">📝 Νέο Αίτημα</h1>

      <div>
        <label htmlFor="title" className="block mb-1 font-medium">Τίτλος</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-1 font-medium">Περιγραφή</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        ></textarea>
      </div>

      <div>
        <label htmlFor="priority" className="block mb-1 font-medium">Προτεραιότητα</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="low">Χαμηλή</option>
          <option value="medium">Μέτρια</option>
          <option value="high">Υψηλή</option>
        </select>
      </div>

      <div>
        <label htmlFor="status" className="block mb-1 font-medium">Κατάσταση</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="open">Ανοιχτό</option>
          <option value="in_progress">Σε εξέλιξη</option>
          <option value="closed">Κλειστό</option>
        </select>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Υποβολή
      </button>
    </form>
  );
}
