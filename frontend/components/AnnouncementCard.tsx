// components/AnnouncementCard.tsx

import { motion } from 'framer-motion';

type Announcement = {
  id: number;
  title: string;
  description: string;
  file: string | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

export default function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  return (
    <motion.div 
      className="p-4 rounded-2xl shadow-md bg-white mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-bold">{announcement.title}</h2>
      <p className="text-gray-700 mt-2">{announcement.description}</p>

      {announcement.file && (
        <div className="mt-4">
          <a href={announcement.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            📎 Προβολή Επισύναψης
          </a>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500">
        Ενεργό από {announcement.start_date} έως {announcement.end_date}
      </div>
    </motion.div>
  );
}
