"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPolls, submitPoll } from "./api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRequestInfo } from "@/hooks/useRequestInfo";

// Types
type Poll = {
  id: number;
  title: string;
  description: string;
  questions: Question[];
};

type Question = {
  id: number;
  text: string;
  question_type: "single" | "multiple" | "text";
  choices?: { id: number; label: string }[];
};

export default function RespondPoll() {
  const router = useRouter();
  const { pollId } = useParams() as { pollId: string };
  const { tenantDomain, accessToken } = useRequestInfo();

  const [poll, setPoll] = useState<Poll | null>(null);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const data = await getPolls(tenantDomain, accessToken);
        const pollData = data.find((p: any) => p.id === Number(pollId));
        if (!pollData) throw new Error("Poll not found.");
        setPoll(pollData);
      } catch (error) {
        console.error("Error fetching poll:", error);
      } finally {
        setLoading(false);
      }
    };
    if (pollId && tenantDomain && accessToken) fetchPoll();
  }, [pollId, tenantDomain, accessToken]);

  const handleChange = (questionId: number, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const formattedAnswers = Object.entries(answers).map(([qId, value]) => {
      const parsed = parseInt(qId, 10);
      if (Array.isArray(value)) {
        return { question: parsed, selected_choices: value };
      } else if (typeof value === "string") {
        return { question: parsed, text_response: value };
      } else {
        return { question: parsed, selected_choices: [value] };
      }
    });

    try {
      await submitPoll(tenantDomain, accessToken, Number(pollId), formattedAnswers);
      alert("Your answers have been submitted successfully.");
      router.push("/polls");
    } catch (error) {
      alert("An error occurred while submitting your responses.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!poll) return <div className="p-4 text-red-600">Poll not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{poll.title}</h1>
      <p className="mb-6 text-gray-600">{poll.description}</p>

      {poll.questions.map((q) => (
        <div key={q.id} className="mb-6">
          <h3 className="font-semibold">{q.text}</h3>
          {q.question_type === "text" && (
            <Textarea
              className="mt-2"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
            />
          )}

          {q.question_type === "single" &&
            q.choices?.map((choice) => (
              <label key={choice.id} className="block mt-2">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={choice.id}
                  checked={answers[q.id] === choice.id}
                  onChange={() => handleChange(q.id, choice.id)}
                /> {choice.label}
              </label>
            ))}

          {q.question_type === "multiple" &&
            q.choices?.map((choice) => (
              <label key={choice.id} className="block mt-2">
                <input
                  type="checkbox"
                  value={choice.id}
                  checked={answers[q.id]?.includes(choice.id) || false}
                  onChange={(e) => {
                    const current = answers[q.id] || [];
                    if (e.target.checked) {
                      handleChange(q.id, [...current, choice.id]);
                    } else {
                      handleChange(
                        q.id,
                        current.filter((id: number) => id !== choice.id)
                      );
                    }
                  }}
                /> {choice.label}
              </label>
            ))}
        </div>
      ))}

      <Button
        onClick={handleSubmit}
        disabled={submitting}
        className="bg-blue-600 text-white"
      >
        {submitting ? "Submitting..." : "Submit My Answers"}
      </Button>
    </div>
  );
}