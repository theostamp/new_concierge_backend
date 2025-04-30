/* =========================================================================
   ΤΥΠΟΙ ΔΕΔΟΜΕΝΩΝ
   ========================================================================= */

   export type Announcement = {
    id: number;
    title: string;
    /** περιεχόμενο / περιγραφή – το χρειάζεται το AnnouncementCard */
    description: string;
    /** προαιρετικό αρχείο (pdf, εικόνα κ.λπ.) */
    file: string | null;
    start_date: string;
    end_date: string;
    is_active: boolean;
    created_at: string;
  };
  
  export type Vote = {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
  };
  
  export type VoteSubmission = {
    choice: 'ΝΑΙ' | 'ΟΧΙ' | 'ΛΕΥΚΟ' | null;
  };
  
  export type VoteResultsData = {
    ΝΑΙ: number;
    ΟΧΙ: number;
    ΛΕΥΚΟ: number;
    total: number;
  };
  
  /* =========================================================================
     ΒΟΗΘΗΤΙΚΟ – έλεγχος απόκρισης
     ========================================================================= */
  async function check(res: Response) {
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }
    return res;
  }
  
  /* =========================================================================
     ΑΝΑΚΟΙΝΩΣΕΙΣ
     ========================================================================= */
  
  export async function fetchAnnouncements(): Promise<Announcement[]> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/announcements/`,
      { cache: 'no-store', credentials: 'include' }
    ).then(check);
  
    /** η DRF σελίδωση επιστρέφει { results: [...] } */
    const json = await res.json();
  
    const rows = (json.results ?? json) as any[];
  
    /* προσαρμόζουμε ώστε να υπάρχουν ΠΑΝΤΑ description & file */
    return rows.map((row): Announcement => ({
      id: row.id,
      title: row.title,
      description: row.description ?? row.content ?? '',
      file: row.file ?? null,
      start_date: row.start_date,
      end_date: row.end_date,
      is_active: row.is_active,
      created_at: row.created_at,
    }));
  }
  
  /* =========================================================================
     ΨΗΦΟΦΟΡΙΕΣ
     ========================================================================= */
  
  export async function fetchVotes(): Promise<Vote[]> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/votes/`,
      { cache: 'no-store', credentials: 'include' }
    ).then(check);
  
    const json = (await res.json()) as { results: Vote[] };
    return json.results;
  }
  
  export async function fetchMyVote(voteId: number): Promise<VoteSubmission> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/votes/${voteId}/my-submission/`,
      { credentials: 'include' }
    ).then(check);
  
    return res.json();
  }
  
  export async function submitVote(
    voteId: number,
    choice: 'ΝΑΙ' | 'ΟΧΙ' | 'ΛΕΥΚΟ'
  ): Promise<void> {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/votes/${voteId}/vote/`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice }),
      }
    ).then(check);
  }
  
  export async function fetchVoteResults(
    voteId: number
  ): Promise<VoteResultsData> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/votes/${voteId}/results/`,
      { credentials: 'include' }
    ).then(check);
  
    return res.json();
  }
  