import React from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FirstSection from "@/components/homePage/FirstSection";
import HomesList from "@/components/home/HomesList";

export default function HomePage() {
  return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="grow">
            <FirstSection />
            <HomesList />
        </main>

        <Footer />
      </div>
  );
}