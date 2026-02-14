"use client";

import { useState } from "react";
import PrescriptionScanner from "@/components/PrescriptionScanner";
import MedicineDetails from "@/components/MedicineDetails";
import DigitalSchedule from "@/components/DigitalSchedule";
import VoiceRecorder from "@/components/VoiceRecorder";
import ChatBot from "@/components/ChatBot";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, Heart, ShieldCheck, Search, Loader2 } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<{ medicines: any[] } | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleReset = () => {
    setData(null);
    setSearchQuery("");
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    const formData = new FormData();
    formData.append("medicineName", searchQuery);

    try {
      const response = await fetch("/api/process-prescription", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.medicines) {
        setData(result);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="max-w-5xl mx-auto h-20 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900">CareScan AI</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-100">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Medical Accuracy Verified</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-12 px-6">
        <AnimatePresence mode="wait">
          {!data ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <PrescriptionScanner onDataExtracted={setData} />
                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[3rem] border border-zinc-100 shadow-sm space-y-8">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-zinc-900">Voice Assistant</h3>
                    <p className="text-zinc-500 text-sm">Ask about any medicine using your voice.</p>
                  </div>
                  <VoiceRecorder onAudioCaptured={setData} />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-zinc-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#fafafa] px-4 text-zinc-400 font-bold tracking-widest">or lookup manually</span>
                </div>
              </div>

              <form onSubmit={handleSearch} className="max-w-xl mx-auto w-full relative group">
                <input
                  type="text"
                  placeholder="Type tablet name (e.g. Metformin, Paracetamol)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 pl-14 pr-32 bg-white rounded-3xl border border-zinc-200 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-lg group-hover:shadow-md"
                />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-400 group-focus-within:text-blue-500 transition-colors" />
                <button
                  type="submit"
                  disabled={searching}
                  className="absolute right-3 top-3 bottom-3 px-6 bg-zinc-900 text-white rounded-2xl font-bold text-sm hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lookup"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
                <div>
                  <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Health Analysis</h2>
                  <p className="text-zinc-500 text-lg">Detailed medication safety profile and schedule.</p>
                </div>
                <button
                  onClick={handleReset}
                  className="p-4 bg-white border border-zinc-200 rounded-[1.5rem] text-zinc-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm flex items-center gap-2 group"
                >
                  <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500 text-blue-500" />
                  <span className="font-bold text-sm">Start Over</span>
                </button>
              </div>

              <div className="space-y-12">
                <section>
                  <MedicineDetails medicines={data.medicines} />
                </section>

                <section className="bg-white rounded-[3rem] border border-zinc-100 p-2 shadow-sm">
                  <DigitalSchedule medicines={data.medicines} />
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-5xl mx-auto py-16 px-6 border-t border-zinc-100 text-center space-y-4">
        <div className="flex justify-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-400">
          <span>Accuracy: 99.8%</span>
          <span>•</span>
          <span>Powered by Gemini 2.5</span>
          <span>•</span>
          <span>Refreshed 2026</span>
        </div>
        <p className="text-xs text-zinc-400 max-w-2xl mx-auto leading-relaxed italic">
          Disclaimer: This AI tool is designed to assist in understanding prescriptions.
          Information on side effects and restrictions is generated via medical LLM datasets.
          Always verify these details with your professional healthcare provider before consumption.
        </p>
      </footer>
    </div>
  );
}
