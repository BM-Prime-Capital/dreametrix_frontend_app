"use client";

import React from "react";
import { persistor, store } from "@/redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// import { SessionProvider } from "next-auth/react"; // UNCOMMENT WHEN next-auth is SET

export default function ReduxProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <SessionProvider> */}
        {children}
        {/* </SessionProvider> */}
      </PersistGate>
    </Provider>
  );
}
