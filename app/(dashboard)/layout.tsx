import { ConversationProvider } from "@/components/context";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { getApiLimitCount } from "@/lib/api-limits";
import { checkSubscription } from "@/lib/subscription";
import Head from "next/head";
import React from "react";

const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Fetch the required values on the server side
  const apiLimitCount = await getApiLimitCount(); // Replace with actual value
  const isPro = await checkSubscription(); // Replace with actual value

  // Set your initial prompt here
  const initialPrompt = "make the words and sentences in the colons into a descriptive paragraph for dalle.2 to generate better and more detailed images. without any introduction or conclusion. word limit 50`"; // Replace with actual prompt

  return (
    <ConversationProvider prompt={initialPrompt}>
      <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-20 md:flex-col md:fixed md:inset-y-0  bg-gray-900">
        <Sidebar isPro={isPro} apiLimitCount={apiLimitCount} />
      </div>
        <main className="md:pl-20 pb-0">
          <Navbar/>
          {children}
        </main>
      </div>
    </ConversationProvider>
  );
};

export default DashboardLayout;
