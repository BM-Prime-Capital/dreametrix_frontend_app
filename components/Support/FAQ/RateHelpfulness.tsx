// components/support/FAQ/RateHelpfulness.tsx
'use client';
import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RateHelpfulness() {
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (value: 'helpful' | 'not-helpful') => {
    setFeedback(value);
    // Envoyer le feedback à l'API
    await fetch('/api/support/feedback', {
      method: 'POST',
      body: JSON.stringify({ helpful: value === 'helpful' })
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="text-sm text-muted-foreground">
        Thank you for your feedback!
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <p className="text-sm text-muted-foreground">Was this helpful?</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleSubmit('helpful')}
        disabled={feedback !== null}
      >
        <ThumbsUp className={`h-4 w-4 mr-1 ${feedback === 'helpful' ? 'text-green-500' : ''}`} />
        Yes
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleSubmit('not-helpful')}
        disabled={feedback !== null}
      >
        <ThumbsDown className={`h-4 w-4 mr-1 ${feedback === 'not-helpful' ? 'text-red-500' : ''}`} />
        No
      </Button>
    </div>
  );
}