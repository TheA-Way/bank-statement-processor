// app/page.tsx
"use client";

import { useState } from "react";
import { TrendingDown, FileSpreadsheet, BarChart2 } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import TransactionTable from "@/components/TransactionTable";
import SpendingChart from "@/components/SpendingChart";
import { ProcessedStatement } from "@/types";

export default function Home() {
  const [data, setData] = useState<ProcessedStatement | null>(null);
  const [activeTab, setActiveTab] = useState<"table" | "chart">("table");

  const handleSuccess = (result: ProcessedStatement) => {
    setData(result);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Statement Analyzer</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Upload Section */}
        {!data ? (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Understand your spending
            </h2>
            <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
              Upload a PDF bank statement and instantly see your transactions
              organized, sorted, and visualized.
            </p>
            <FileUpload onSuccess={handleSuccess} />
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${data.total_spent.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Transactions</p>
                <p className="text-3xl font-bold text-gray-900">
                  {data.transaction_count}
                </p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Period</p>
                <p className="text-xl font-bold text-gray-900">
                  {data.date_range || "—"}
                </p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab("table")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  activeTab === "table"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                Transactions
              </button>
              <button
                onClick={() => setActiveTab("chart")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  activeTab === "chart"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                Spending Chart
              </button>
              
              <button
                onClick={() => setData(null)}
                className="ml-auto px-4 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Upload another
              </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              {activeTab === "table" ? (
                <TransactionTable transactions={data.transactions} />
              ) : (
                <SpendingChart transactions={data.transactions} />
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}