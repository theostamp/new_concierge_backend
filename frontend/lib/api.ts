
// C:\Users\Notebook\new_concierge\frontend\lib\api.ts
/* =========================================================================
   ΤΥΠΟΙ ΔΕΔΟΜΕΝΩΝ
   ========================================================================= */

   export type Announcement = {
    id: number;
    title: string;
    description: string;
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
  
  export type UserRequest = {
    id: number;
    title: string;
    description: string;
    status: string;
    created_at: string;
    updated_at?: string;
    created_by?: number;
    created_by_username: string;
    supporter_count: number;
    supporter_usernames?: string[];
    is_urgent: boolean;
    type?: string;
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcements/`, {
      cache: 'no-store',
      credentials: 'include',
    }).then(check);
  
    const json = await res.json();
    let rows: any[] = [];
    if (Array.isArray(json.results)) {
      rows = json.results;
    } else if (Array.isArray(json)) {
      rows = json;
    }
  
    return rows.map((row: any): Announcement => ({
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votes/`, {
      cache: 'no-store',
      credentials: 'include',
    }).then(check);
  
    const json = await res.json();
    let rows: any[] = [];
    if (Array.isArray(json.results)) {
      rows = json.results;
    } else if (Array.isArray(json)) {
      rows = json;
    }
  
    return rows.map((v: any): Vote => ({
      id: v.id,
      title: v.title,
      description: v.description,
      start_date: v.start_date,
      end_date: v.end_date,
    }));
  }
  
  export async function fetchMyVote(voteId: number): Promise<VoteSubmission> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votes/${voteId}/my-submission/`, {
      credentials: 'include',
    }).then(check);
  
    return res.json();
  }
  
  export async function submitVote(
    voteId: number,
    choice: 'ΝΑΙ' | 'ΟΧΙ' | 'ΛΕΥΚΟ'
  ): Promise<void> {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votes/${voteId}/vote/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choice }),
    }).then(check);
  }
  
  export async function fetchVoteResults(voteId: number): Promise<VoteResultsData> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/votes/${voteId}/results/`, {
      credentials: 'include',
    }).then(check);
  
    return res.json();
  }
  
  /* =========================================================================
     ΑΙΤΗΜΑΤΑ
     ========================================================================= */
  
  export async function fetchRequests(status: string = ''): Promise<UserRequest[]> {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/user-requests/`);
    if (status) url.searchParams.append('status', status);
  
    const res = await fetch(url.toString(), {
      cache: 'no-store',
      credentials: 'include',
    }).then(check);
  
    const json = await res.json();
    let rows: any[] = [];
    if (Array.isArray(json.results)) {
      rows = json.results;
    } else if (Array.isArray(json)) {
      rows = json;
    }
  
    return rows.map((r: any): UserRequest => ({
      id: r.id,
      title: r.title,
      description: r.description,
      status: r.status,
      created_at: r.created_at,
      updated_at: r.updated_at,
      created_by: r.created_by,
      created_by_username: r.created_by_username,
      supporter_count: r.supporter_count ?? 0,
      supporter_usernames: r.supporter_usernames ?? [],
      is_urgent: r.is_urgent ?? false,
      type: r.type ?? '',
    }));
  }
  
  export async function fetchTopRequests(): Promise<UserRequest[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-requests/top/`, {
      cache: 'no-store',
      credentials: 'include',
    }).then(check);
  
    const json = await res.json();
    let rows: any[] = [];
    if (Array.isArray(json.results)) {
      rows = json.results;
    } else if (Array.isArray(json)) {
      rows = json;
    } else {
      rows = [];
    }
  
    return rows.map((r: any): UserRequest => ({
      id: r.id,
      title: r.title,
      description: r.description,
      status: r.status,
      created_at: r.created_at,
      updated_at: r.updated_at,
      created_by: r.created_by,
      created_by_username: r.created_by_username,
      supporter_count: r.supporter_count,
      supporter_usernames: r.supporter_usernames,
      is_urgent: r.is_urgent,
    }));
  }
  

  export async function toggleSupportRequest(id: number): Promise<{ status: string }> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-requests/${id}/support/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken') ?? '',
      },
    });
  
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || 'Σφάλμα υποστήριξης αιτήματος');
    }
  
    return res.json();
  }
  
  function getCookie(name: string): string | null {
    const regex = new RegExp('(^| )' + name + '=([^;]+)');
    const match = regex.exec(document.cookie);
    return match ? match[2] : null;
  }
  