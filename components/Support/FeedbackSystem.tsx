import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type FeedbackType = 'rating' | 'satisfaction' | 'detailed';

type FeedbackData = {
  id: string;
  type: FeedbackType;
  rating?: number;
  satisfaction?: 'positive' | 'negative';
  comment?: string;
  ticketId?: string;
  supportAgent?: string;
  category?: string;
  timestamp: Date;
};

interface FeedbackSystemProps {
  ticketId?: string;
  supportAgent?: string;
  onFeedbackSubmit?: (feedback: FeedbackData) => void;
  showInline?: boolean;
}

export default function FeedbackSystem({ 
  ticketId, 
  supportAgent, 
  onFeedbackSubmit,
  showInline = false 
}: FeedbackSystemProps) {
  const [activeType, setActiveType] = useState<FeedbackType>('rating');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [satisfaction, setSatisfaction] = useState<'positive' | 'negative' | null>(null);
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const feedbackData: FeedbackData = {
      id: Date.now().toString(),
      type: activeType,
      rating: activeType === 'rating' ? rating : undefined,
      satisfaction: activeType === 'satisfaction' ? satisfaction : undefined,
      comment: comment || undefined,
      ticketId,
      supportAgent,
      category: category || undefined,
      timestamp: new Date()
    };

    // Simulate API call
    setTimeout(() => {
      onFeedbackSubmit?.(feedbackData);
      setIsSubmitted(true);
      setIsSubmitting(false);
    }, 1000);
  };

  const resetForm = () => {
    setRating(0);
    setSatisfaction(null);
    setComment('');
    setCategory('');
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <Card className={showInline ? 'border-green-200 bg-green-50' : ''}>
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className="font-semibold text-green-800">Thank you for your feedback!</h3>
            <p className="text-sm text-green-600">
              Your input helps us improve our support experience.
            </p>
            <Button variant="outline" size="sm" onClick={resetForm}>
              Submit More Feedback
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={showInline ? 'border-blue-200 bg-blue-50' : ''}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">How was your support experience?</h3>
          <div className="flex gap-1">
            <Button
              variant={activeType === 'rating' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveType('rating')}
            >
              Rating
            </Button>
            <Button
              variant={activeType === 'satisfaction' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveType('satisfaction')}
            >
              Quick
            </Button>
            <Button
              variant={activeType === 'detailed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveType('detailed')}
            >
              Detailed
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Rating Feedback */}
        {activeType === 'rating' && (
          <div className="space-y-4">
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="p-1 transition-colors"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star 
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating) 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <div className="text-center text-sm text-muted-foreground">
              {rating > 0 && (
                <span>
                  {rating === 1 && "Poor"}
                  {rating === 2 && "Fair"}
                  {rating === 3 && "Good"}
                  {rating === 4 && "Very Good"}
                  {rating === 5 && "Excellent"}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Satisfaction Feedback */}
        {activeType === 'satisfaction' && (
          <div className="flex justify-center gap-4">
            <Button
              variant={satisfaction === 'positive' ? 'default' : 'outline'}
              size="lg"
              onClick={() => setSatisfaction('positive')}
              className="flex items-center gap-2"
            >
              <ThumbsUp className="h-5 w-5" />
              Helpful
            </Button>
            <Button
              variant={satisfaction === 'negative' ? 'destructive' : 'outline'}
              size="lg"
              onClick={() => setSatisfaction('negative')}
              className="flex items-center gap-2"
            >
              <ThumbsDown className="h-5 w-5" />
              Not Helpful
            </Button>
          </div>
        )}

        {/* Detailed Feedback */}
        {activeType === 'detailed' && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Category (Optional)</label>
              <Input
                placeholder="e.g., Response time, Solution quality, Agent helpfulness"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Comment section for all types */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Additional Comments {activeType === 'detailed' ? '(Required)' : '(Optional)'}
          </label>
          <textarea
            className="w-full p-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Tell us more about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required={activeType === 'detailed'}
          />
        </div>

        {/* Ticket and Agent info */}
        {(ticketId || supportAgent) && (
          <div className="flex gap-2 text-xs text-muted-foreground">
            {ticketId && <Badge variant="outline">Ticket #{ticketId}</Badge>}
            {supportAgent && <Badge variant="outline">Agent: {supportAgent}</Badge>}
          </div>
        )}

        {/* Submit button */}
        <Button 
          onClick={handleSubmit}
          disabled={
            isSubmitting || 
            (activeType === 'rating' && rating === 0) ||
            (activeType === 'satisfaction' && satisfaction === null) ||
            (activeType === 'detailed' && !comment.trim())
          }
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Feedback
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}