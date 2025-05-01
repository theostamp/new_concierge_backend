// frontend/app/votes/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ErrorMessage from '@/components/ErrorMessage';
import { csrfFetch } from '@/lib/api';   // ➜ φέρνουμε τον helper

export default function NewVotePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [choices, setChoices] = useState<string[]>(['', '']);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function updateChoice(index: number, value: string) {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  }

  function addChoice() {
    setChoices([...choices, '']);
  }

  function removeChoice(index: number) {
    if (choices.length <= 2) return;
    const updated = choices.filter((_, i) => i !== index);
    setChoices(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
  
    const validChoices = choices.filter((c) => c.trim() !== '');
    if (validChoices.length < 2) {
      setError('Χρειάζονται τουλάχιστον 2 επιλογές.');
      setSubmitting(false);
      return;
    }
  
    try {
      await csrfFetch(`${process.env.NEXT_PUBLIC_API_URL}/votes/`, {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          start_date: startDate || null,
          end_date: endDate || null,
          choices: validChoices,
        }),
      });
  
      router.push('/votes');           // ✅ 201 Created ⇒ redirect
    } catch (err) {
      setError((err as Error).message ?? 'Αποτυχία δημιουργίας ψηφοφορίας');
    } finally {
      setSubmitting(false);
    }
  }
  

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🗳️ Νέα Ψηφοφορία</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="vote-title" className="block text-sm font-medium">Τίτλος</label>
          <input
            id="vote-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="vote-description" className="block text-sm font-medium">Περιγραφή</label>
          <textarea
            id="vote-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2 h-24"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="vote-start-date" className="block text-sm font-medium">Έναρξη</label>
            <input
              id="vote-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="vote-end-date" className="block text-sm font-medium">Λήξη</label>
            <input
              id="vote-end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="vote-choice-0" className="block text-sm font-medium">Επιλογές Ψήφου</label>
          <div className="space-y-2 mt-2">
            {choices.map((choice, index) => (
              <div key={`${choice}-${index}`} className="flex gap-2">
                <input
                  id={`vote-choice-${index}`}
                  value={choice}
                  onChange={(e) => updateChoice(index, e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                  required
                />
                {choices.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeChoice(index)}
                    className="text-red-500 text-sm"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addChoice}
              className="text-sm text-blue-600 hover:underline"
            >
              ➕ Προσθήκη επιλογής
            </button>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Δημιουργία
        </button>
      </form>
    </div>
  );
}
