'use client';

import { useState, useEffect } from 'react';
import { submitVote, fetchMyVote, fetchVoteResults } from '@/lib/api';
import VoteResults from './VoteResults';

type Vote = {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
};

export default function VoteCard({ vote }: { readonly vote: Vote }) {
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [results, setResults] = useState<{ ΝΑΙ: number; ΟΧΙ: number; ΛΕΥΚΟ: number; total: number } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const isActive =
    new Date(vote.start_date) <= today && today <= new Date(vote.end_date);

  useEffect(() => {
    fetchMyVote(vote.id)
      .then((data) => {
        setUserChoice(data.choice); // "ΝΑΙ", "ΟΧΙ" ή null
      })
      .catch((err) => {
        console.error('Σφάλμα κατά τη λήψη ψήφου:', err);
      });
  }, [vote.id]);

  useEffect(() => {
    if (userChoice) {
      fetchVoteResults(vote.id)
        .then((data) => setResults(data))
        .catch((err) => console.error('Σφάλμα κατά τη λήψη αποτελεσμάτων:', err));
    }
  }, [userChoice]);

  async function handleVote(choice: string) {
    setLoading(true);
    setError('');

    try {
      await submitVote(vote.id, choice);
      setUserChoice(choice); // ενημερώνουμε την ψήφο
    } catch (err) {
      if (err instanceof Error) {
        setError(`Αποτυχία υποβολής: ${err.message}`);
      } else {
        setError('Αποτυχία υποβολής. Δοκιμάστε ξανά.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 rounded-2xl shadow-md bg-white mb-4">
      <h2 className="text-xl font-bold">{vote.title}</h2>
      <p className="text-gray-700 mt-2">{vote.description}</p>

      <div className="mt-4">

      {(() => {
        if (userChoice) {
          return (
            <>
              <p className="text-green-600 font-semibold">✅ Η ψήφος σας: {userChoice}</p>
              {results && <VoteResults results={results} />}
            </>
          );
        } else if (isActive) {
          return (
            <div className="flex gap-4">
              <button
                onClick={() => handleVote('ΝΑΙ')}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
              >
                ✅ ΝΑΙ
              </button>
              <button
                onClick={() => handleVote('ΟΧΙ')}
                disabled={loading}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
              >
                ❌ ΟΧΙ
              </button>
            </div>
          );
        } else {
          return (
            <p className="text-yellow-600 font-semibold">
              ⚠️ Η ψηφοφορία δεν είναι διαθέσιμη αυτή τη στιγμή.
            </p>
          );
        }
      })()}

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div className="mt-2 text-xs text-gray-500">
        Από {vote.start_date} έως {vote.end_date}
      </div>
    </div>
  );
}
