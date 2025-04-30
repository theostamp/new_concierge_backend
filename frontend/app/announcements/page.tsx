'use client';

import { useEffect, useState } from 'react';
import { fetchAnnouncements } from '@/lib/api';
import AnnouncementCard from '@/components/AnnouncementCard';
import AnnouncementSkeleton from '@/components/AnnouncementSkeleton';
import ErrorMessage from '@/components/ErrorMessage';
import { motion } from 'framer-motion';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  async function loadAnnouncements() {
    try {
      const data = await fetchAnnouncements();
      if (Array.isArray(data)) {
        setAnnouncements(data.filter((item: any) => item.is_active));
      } else {
        setAnnouncements([]);
      }
      setError(false);
      setLastUpdated(new Date().toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error(err);
      setError(true);
      setAnnouncements([]); // Βασικό: πάντα array
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnnouncements();

    const interval = setInterval(() => {
      loadAnnouncements();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📢 Ανακοινώσεις</h1>

      {(() => {
        if (loading) {
          return (
            <>
              <AnnouncementSkeleton />
              <AnnouncementSkeleton />
              <AnnouncementSkeleton />
            </>
          );
        } else if (error) {
          return (
            <ErrorMessage message="Αδυναμία φόρτωσης ανακοινώσεων. Παρακαλώ δοκιμάστε ξανά αργότερα." />
          );
        } else if (announcements.length > 0) {
          return (
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {announcements.map((announcement: any) => (
                <motion.div key={announcement.id} variants={item}>
                  <AnnouncementCard announcement={announcement} />
                </motion.div>
              ))}
            </motion.div>
          );
        } else {
          return (
            <div className="text-gray-500 text-center">
              Δεν υπάρχουν ενεργές ανακοινώσεις αυτή τη στιγμή.
            </div>
          );
        }
      })()}

      {!loading && lastUpdated && (
        <div className="text-xs text-gray-400 text-center mt-8">
          Τελευταία ενημέρωση: {lastUpdated}
        </div>
      )}
    </div>
  );
}
