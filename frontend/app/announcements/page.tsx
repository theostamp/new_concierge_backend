// app/announcements/page.tsx

import { fetchAnnouncements } from '@/lib/api';
import AnnouncementCard from '@/components/AnnouncementCard';

export default async function AnnouncementsPage() {
  let announcements = [];

  try {
    announcements = await fetchAnnouncements();
  } catch (error) {
    console.error(error);
  }

  const activeAnnouncements = announcements.filter((item: any) => item.is_active);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📢 Ανακοινώσεις</h1>

      {activeAnnouncements.length > 0 ? (
        activeAnnouncements.map((announcement: any) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))
      ) : (
        <p className="text-gray-500">Δεν υπάρχουν ενεργές ανακοινώσεις αυτή τη στιγμή.</p>
      )}
    </div>
  );
}
