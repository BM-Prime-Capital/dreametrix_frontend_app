'use client';

import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

type FeedbackData = {
  rating: number;
  satisfaction: 'satisfied' | 'dissatisfied' | null;
  comment: string;
  categories: string[];
};

const FEEDBACK_CATEGORIES = [
  { id: 'response_time', label: 'Response Time' },
  { id: 'solution_quality', label: 'Solution Quality' },
  { id: 'agent_helpfulness', label: 'Agent Helpfulness' },
  { id: 'communication', label: 'Communication' },
  { id: 'follow_up', label: 'Follow-up' },
];

interface TicketFeedbackProps {
  ticketId: string;
  onFeedbackSubmit: (feedback: FeedbackData) => void;
  onClose: () => void;
}

export default function TicketFeedback({ ticketId, onFeedbackSubmit, onClose }: TicketFeedbackProps) {
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 0,
    satisfaction: null,
    comment: '',
    categories: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const handleSatisfactionChange = (satisfaction: 'satisfied' | 'dissatisfied') => {
    setFeedback(prev => ({ 
      ...prev, 
      satisfaction: prev.satisfaction === satisfaction ? null : satisfaction 
    }));
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFeedback(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onFeedbackSubmit(feedback);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = feedback.rating > 0 && feedback.satisfaction !== null;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          How was your support experience?
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your feedback helps us improve our support quality
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Star Rating */}
        <div className="space-y-2">
          <Label>Overall Rating</Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant="ghost"
                size="sm"
                onClick={() => handleRatingChange(star)}
                className="p-1 hover:bg-transparent"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= feedback.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </Button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {feedback.rating > 0 && `${feedback.rating}/5`}
            </span>
          </div>
        </div>

        {/* Satisfaction */}
        <div className="space-y-2">
          <Label>Were you satisfied with the resolution?</Label>
          <div className="flex gap-3">
            <Button
              variant={feedback.satisfaction === 'satisfied' ? 'default' : 'outline'}
              onClick={() => handleSatisfactionChange('satisfied')}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="h-4 w-4" />
              Yes, satisfied
            </Button>
            <Button
              variant={feedback.satisfaction === 'dissatisfied' ? 'destructive' : 'outline'}
              onClick={() => handleSatisfactionChange('dissatisfied')}
              className="flex items-center gap-2"
            >
              <ThumbsDown className="h-4 w-4" />
              No, dissatisfied
            </Button>
          </div>
        </div>

        {/* Feedback Categories */}
        <div className="space-y-2">
          <Label>What went well? (Optional)</Label>
          <div className="grid grid-cols-2 gap-2">
            {FEEDBACK_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={feedback.categories.includes(category.id) ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryToggle(category.id)}
                className="justify-start"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <Label htmlFor="comment">Additional Comments (Optional)</Label>
          <Textarea
            id="comment"
            placeholder="Tell us more about your experience..."
            value={feedback.comment}
            onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
            rows={3}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Maybe Later
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}