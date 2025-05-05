"use client";

import React, { useState } from "react";
import AttendanceGeneralView from "./AttendanceGeneralView";
import AttendanceFocusedView from "./AttendanceFocusedView";
import { views } from "@/constants/global";
import { Toaster } from "react-hot-toast";

function Attendance() {
  const [view, setView] = useState<string>(views.GENERAL_VIEW);
  return (
    <>
    <Toaster 
      position="top-center"
      toastOptions={{
        duration: 4000,
        // Style de base pour tous les toasts
        style: {
          color: '#fff',
          minWidth: '300px',
          background: '#363636', // Couleur par défaut
        },
        // Personnalisation par type de toast
        success: {
          style: {
            background: '#16a34a', // Vert plus vif
            borderLeft: '4px solid #22c55e', // Bordure accent
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#16a34a',
          },
        },
        error: {
          style: {
            background: '#dc2626', // Rouge
            borderLeft: '4px solid #ef4444',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#dc2626',
          },
        },
        loading: {
          style: {
            background: '#2563eb', // Bleu
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#2563eb',
          },
        }
      }}
    />
      {view === views.GENERAL_VIEW ? (
        <AttendanceGeneralView
          changeView={(viewName: string) => setView(viewName)}
        />
      ) : (
        <AttendanceFocusedView
          changeView={(viewName: string) => setView(viewName)}
        />
      )}
    </>
  );
}

export default Attendance;