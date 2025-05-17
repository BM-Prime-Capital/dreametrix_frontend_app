"use client";

import { Card } from "@/components/ui/card";
import { ClassesTable } from "./classes-table";
import AllClassFiltersPopUp from "./AllClassFiltersPopUp";
import { AddClassDialog } from "./AddClassDialog";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ClassesPage() {
  const [refreshTime, setRefreshTime] = useState<string>("");
  
  return (
    <section className="flex flex-col gap-6 w-full">
      {/* Header Élégant */}
      <div className="relative group overflow-hidden rounded-xl bg-white dark:bg-gray-950 p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Effet de lumière subtil */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-blue-900/20" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                  Classes
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                  Gestion centralisée de vos espaces pédagogiques
                </p>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 relative z-20"
            >
              <AllClassFiltersPopUp />
              <AddClassDialog setRefreshTime={setRefreshTime} />
            </motion.div>
          </div>
        </div>
        
        {/* Barre d'accentuation */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400/0 via-blue-400/40 to-blue-400/0 dark:via-blue-500/30" />
      </div>

      {/* Contenu */}
      <Card className="rounded-lg border border-gray-200 dark:border-gray-800 shadow-xs overflow-hidden">
        <ClassesTable refreshTime={refreshTime} setRefreshTime={setRefreshTime} />
      </Card>
    </section>
  );
}