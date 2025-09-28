'use client';

import { useState } from 'react';
import { LifeBuoy, Mail, AlertTriangle, CheckCircle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function SupportTicketForm() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/support/tickets/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, description, priority }),
      });

      if (!response.ok) throw new Error("Failed to submit ticket");

      setSuccess(true);
      setSubject("");
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Bouton de retour ajouté ici */}
      <Button variant="ghost" className="pl-0" asChild>
        <Link href="/teacher/support" className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Back to Support Center
        </Link>
      </Button>

      <Card className="border-none shadow-lg">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <LifeBuoy className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Create Support Ticket</CardTitle>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="pt-6 space-y-6">
            {success && (
              <Alert variant="default" className="border-green-500 bg-green-50 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Your ticket has been submitted successfully. We'll contact you soon.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Briefly describe your issue"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={6}
                placeholder="Provide detailed information about your issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={priority === 'low' ? 'default' : 'outline'}
                  onClick={() => setPriority('low')}
                >
                  Low
                </Button>
                <Button
                  type="button"
                  variant={priority === 'medium' ? 'default' : 'outline'}
                  onClick={() => setPriority('medium')}
                >
                  Medium
                </Button>
                <Button
                  type="button"
                  variant={priority === 'high' ? 'destructive' : 'outline'}
                  onClick={() => setPriority('high')}
                >
                  High
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" type="button" asChild>
              <a href="mailto:support@dreametrix.com" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Support
              </a>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}