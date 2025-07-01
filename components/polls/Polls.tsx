"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { PollsTable } from "./polls-table";
import GlobalPollResults from "./GlobalPollResults";
import PollRespondents from "./PollRespondents";
import { PollResults } from "./PollResults";

type PollView = "table" | "global" | "respondents" | "results";

export default function PollsDashboard() {
  const [view, setView] = useState<PollView>("table");
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);
  const { tenantDomain, accessToken } = useRequestInfo();

  const goTo = (newView: PollView, pollId?: number) => {
    setSelectedPollId(pollId ?? null);
    setView(newView);
  };

  const tabItems = [
    {
      value: "table",
      label: "All Polls",
      icon: <Icons.table className="h-4 w-4" />,
      disabled: false,
    },
    {
      value: "global",
      label: "Global View",
      icon: <Icons.global className="h-4 w-4" />,
      disabled: false,
    },
    {
      value: "respondents",
      label: "Respondents",
      icon: <Icons.users className="h-4 w-4" />,
      disabled: view !== "respondents",
    },
    {
      value: "results",
      label: "Results",
      icon: <Icons.barChart className="h-4 w-4" />,
      disabled: view !== "results",
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-gray-900">Polls Dashboard</h1>
          <p className="text-gray-500 mt-1">
            {view === "table" && "Manage and analyze all your polls"}
            {view === "global" && "Global results across all polls"}
            {view === "respondents" && "View poll respondents"}
            {view === "results" && "Detailed poll results"}
          </p>
        </motion.div>

        <Card className="p-1 bg-white rounded-lg shadow-sm">
          <Tabs value={view} onValueChange={(v) => goTo(v as PollView)}>
            <TabsList className="grid w-full grid-cols-4 bg-gray-50 p-1 h-auto rounded-md gap-1">
              {tabItems.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                  className={`py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-xs data-[state=active]:text-blue-600 transition-all ${
                    item.disabled ? "opacity-50" : "hover:bg-gray-100"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    <span className="hidden sm:inline">{item.label}</span>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </Card>

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {view === "table" && (
              <PollsTable
                onViewRespondents={(id) => goTo("respondents", id)}
                onViewResults={(id) => goTo("results", id)}
                onViewGlobal={() => goTo("global")}
              />
            )}
            {view === "global" && <GlobalPollResults onBack={() => goTo("table")} />}
            {view === "respondents" && selectedPollId && (
              <PollRespondents pollId={selectedPollId} onBack={() => goTo("table")} />
            )}
            {view === "results" && selectedPollId && (
              <PollResults
                pollId={selectedPollId}
                domain={tenantDomain}
                token={accessToken}
                onBack={() => goTo("table")}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
