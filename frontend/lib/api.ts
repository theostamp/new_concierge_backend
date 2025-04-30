// lib/api.ts

export async function fetchAnnouncements() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcements/`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Αποτυχία λήψης ανακοινώσεων');
  }

  return res.json();
}

export async function fetchVotes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votes/`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Αποτυχία λήψης ψηφοφοριών');
  }

  const data = await res.json();
  return data.results;
}



export async function fetchMyVote(voteId: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votes/${voteId}/my-submission/`, {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Αποτυχία λήψης ψήφου χρήστη');
  }

  return res.json(); // { choice: "ΝΑΙ" } ή { choice: null }
}

export async function submitVote(voteId: number, choice: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votes/${voteId}/vote/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ choice }),
  });

  if (!res.ok) {
    throw new Error('Αποτυχία υποβολής ψήφου');
  }

  return res.json();
}
function getCookie(arg0: string): string {
  throw new Error('Function not implemented.');
}

export async function fetchVoteResults(voteId: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votes/${voteId}/results/`, {
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Αποτυχία λήψης αποτελεσμάτων');
  }

  return res.json(); // { ΝΑΙ: number, ΟΧΙ: number, ΛΕΥΚΟ: number, total: number }
}


