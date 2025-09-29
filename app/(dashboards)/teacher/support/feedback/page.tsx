"use client";

import TicketFeedback from "@/components/Support/Feedback/TicketFeedback";

export default function FeedbackPage() {
  const handleFeedbackSubmit = (feedback: any) => {
    console.log('Feedback submitted:', feedback);
  };

  const handleClose = () => {
    console.log('Feedback modal closed');
  };

  return (
    <TicketFeedback 
      ticketId="12345"
      onFeedbackSubmit={handleFeedbackSubmit}
      onClose={handleClose}
    />
  );
}