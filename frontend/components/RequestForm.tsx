'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import useCsrf from '@/hooks/useCsrf';

export default function RequestForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const csrfToken = useCsrf();

  if (!csrfToken) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center text-gray-500">
        🛡️ Φόρτωση CSRF token...
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Ο τίτλος είναι υποχρεωτικός');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-requests/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) {
        throw new Error('Σφάλμα κατά την υποβολή του αιτήματος');
      }

      await res.json();
      toast.success('Το αίτημα υποβλήθηκε με επιτυχία');
      router.push('/requests');
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto mt-6 shadow-xl">
      <CardContent className="space-y-4 p-6">
        <h2 className="text-xl font-semibold">Νέο Αίτημα</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Τίτλος *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Περιγραφή</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Υποβολή...' : 'Υποβολή Αιτήματος'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
