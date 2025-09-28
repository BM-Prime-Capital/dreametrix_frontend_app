'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { LifeBuoy, ChevronLeft, Loader2, AlertCircle, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type Ticket = {
  id: number;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  created_at: string;
};

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (axios.get<Ticket[]>("/api/support/tickets/") as Promise<{ data: Ticket[] }>)
      .then((res) => {
        setTickets(res.data);
      })
      .catch((err) => {
        console.error("Error fetching tickets:", err);
        setError("Failed to load tickets. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-yellow-500 text-yellow-600 bg-yellow-50"
          >
            <Circle className="h-2 w-2 fill-yellow-500 text-yellow-500" />
            Open
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-blue-500 text-blue-600 bg-blue-50"
          >
            <Loader2 className="h-2 w-2 animate-spin text-blue-500" />
            In Progress
          </Badge>
        );
      case "closed":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-green-500 text-green-600 bg-green-50"
          >
            <CheckCircle2 className="h-2 w-2 text-green-500" />
            Closed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <Button variant="ghost" className="pl-0" asChild>
        <Link href="/teacher/support" className="flex items-center gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Support Center
        </Link>
      </Button>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <LifeBuoy className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>My Support Tickets</CardTitle>
              <CardDescription>View all your support requests</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tickets found</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/teacher/support/new">Create New Ticket</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-medium">{ticket.subject}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Created on {new Date(ticket.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}