"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import TeachFiltersPopUp from "./TeachFiltersPopUp";
import { AddPollsDialog } from "./AddPollsDialog";
import { PollsTable } from "./polls-table";
import PollRespondents from "./PollRespondents";
import GlobalPollResults from "./GlobalPollResults";
import { PollResults } from "./PollResults";

import { Button } from "@/components/ui/button";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

type PollView = "table" | "global" | "respondents" | "results";

export default function Polls() {
  const [view, setView] = useState<PollView>("table");
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);
  const { tenantDomain, accessToken } = useRequestInfo();

  const goTo = (newView: PollView, pollId?: number) => {
    setSelectedPollId(pollId ?? null);
    setView(newView);
  };

  const renderContent = () => {
    switch (view) {
      case "table":
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <AddPollsDialog />
              </div>
              <Button 
                onClick={() => goTo("global")} 
                variant="outline"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
              >
                Global Results
              </Button>
            </div>
            <Card className="rounded-xl shadow-sm border-0">
              <PollsTable
                onViewRespondents={(id: number) => goTo("respondents", id)}
                onViewResults={(id: number) => goTo("results", id)}
              />
            </Card>
          </motion.div>
        );
      case "global":
        return <GlobalPollResults onBack={() => goTo("table")} />;
      case "respondents":
        return selectedPollId ? (
          <PollRespondents 
            pollId={selectedPollId} 
            onBack={() => goTo("table")} 
          />
        ) : null;
      case "results":
        return selectedPollId ? (
          <PollResults 
            pollId={selectedPollId} 
            domain={tenantDomain} 
            token={accessToken} 
            onBack={() => goTo("table")}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <section className="flex flex-col gap-6 w-full p-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <PageTitleH1 title="Polls Dashboard" className="text-3xl font-bold text-gray-800" />
          <TeachFiltersPopUp />
        </div>
        
        <Tabs value={view} onValueChange={(v) => goTo(v as PollView)}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 h-auto rounded-lg">
            <TabsTrigger value="table" className="py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                All Polls
              </span>
            </TabsTrigger>
            <TabsTrigger value="global" className="py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M16 8l-4 4-4-4"></path>
                </svg>
                Global View
              </span>
            </TabsTrigger>
            <TabsTrigger value="respondents" disabled={view !== "respondents"} className="py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Respondents
            </TabsTrigger>
            <TabsTrigger value="results" disabled={view !== "results"} className="py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Results
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </section>
  );
}