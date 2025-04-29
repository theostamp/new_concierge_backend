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
  