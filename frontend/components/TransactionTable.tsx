// components/TransactionTable.tsx
"use client"; 

import { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, ChevronRight } from "lucide-react";
import { Transaction, MerchantGroup, SortField, SortDirection } from "@/types";


interface TransactionTableProps {
  transactions: Transaction[];
}

function groupByMerchant(transactions: Transaction[]): MerchantGroup[] {
  const grouped: Record<string, Transaction[]> = {};

  for (const transaction of transactions) {
    const key = transaction.merchant;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(transaction);
  }

  return Object.entries(grouped).map(([merchant, transactions]) => {
    const sortedTransactions = [...transactions].sort(
      (a, b) => b.amount - a.amount
    );

    const total = transactions.reduce((sum, t) => sum + t.amount, 0);

    return {
      merchant,
      transactions: sortedTransactions,
      total: Math.round(total * 100) / 100,  // Round to 2 decimal places
      count: transactions.length,
    };
  });
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  
  const [isGrouped, setIsGrouped] = useState(false);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
 

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const toggleGroup = (merchant: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(merchant)) {
        next.delete(merchant);  
      } else {
        next.add(merchant);   
      }
      return next;
    });
  };

  const processedData = useMemo(() => {
    if (isGrouped) {
      const groups = groupByMerchant(transactions);
      
      return groups.sort((a, b) => {
        if (sortField === "merchant") {
          const comparison = a.merchant.localeCompare(b.merchant);
          return sortDirection === "asc" ? comparison : -comparison;
        } else {
          return sortDirection === "asc"
            ? a.total - b.total
            : b.total - a.total;
        }
      });
    } else {
      return [...transactions].sort((a, b) => {
        if (sortField === "merchant") {
          const comparison = a.merchant.localeCompare(b.merchant);
          return sortDirection === "asc" ? comparison : -comparison;
        } else {
          return sortDirection === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        }
      });
    }
  }, [transactions, isGrouped, sortField, sortDirection]);


  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronDown className="inline w-4 h-4 opacity-30" />;
    }
    return sortDirection === "asc"
      ? <ChevronUp className="inline w-4 h-4 text-sky-400" />
      : <ChevronDown className="inline w-4 h-4 text-sky-400" />;
  };

  return (
    <div className="w-full">
      
      {/* Controls */}
      <div className="flex gap-4 mb-4 items-center flex-wrap">
        <span className="text-sm text-gray-500">
          {transactions.length} transactions
        </span>
        
        <button
          onClick={() => setIsGrouped(g => !g)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isGrouped
              ? "bg-sky-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {isGrouped ? "✓ Grouped by Merchant" : "Group by Merchant"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {isGrouped && <th className="w-8 px-4 py-3" />}
              
              {/* Clickable column headers for sorting */}
              <th
                className="px-4 py-3 text-left font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort("merchant")}
              >
                Merchant <SortIcon field="merchant" />
              </th>
              
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Date
              </th>
              
              <th
                className="px-4 py-3 text-right font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort("amount")}
              >
                Amount <SortIcon field="amount" />
              </th>
              
              {isGrouped && (
                <th className="px-4 py-3 text-right font-semibold text-gray-700">
                  # Purchases
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100">
            {isGrouped ? (
              (processedData as MerchantGroup[]).map((group) => (
                <>
                  {/* Group header row */}
                  <tr
                    key={`group-${group.merchant}`}
                    className="bg-white hover:bg-sky-50 cursor-pointer font-medium"
                    onClick={() => toggleGroup(group.merchant)}
                  >
                    <td className="px-4 py-3">
                      <ChevronRight
                        className={`w-4 h-4 text-gray-700 transition-transform ${
                          expandedGroups.has(group.merchant) ? "rotate-90" : ""
                        }`}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-800">{group.merchant}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs">
                      {group.count} purchase{group.count > 1 ? "s" : ""}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-700">
                      ${group.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {group.count}
                    </td>
                  </tr>
                  
                  {/* Individual transactions within the group (expandable) */}
                  {expandedGroups.has(group.merchant) &&
                    group.transactions.map((t, i) => (
                      <tr
                        key={`${group.merchant}-${i}`}
                        className="bg-gray-50 text-gray-700"
                      >
                        <td className="px-4 py-2" />
                        <td className="px-4 py-2 pl-10 text-xs">
                          {t.merchant}
                        </td>
                        <td className="px-4 py-2 text-xs">{t.date}</td>
                        <td className="px-4 py-2 text-right text-xs">
                          ${t.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-2" />
                      </tr>
                    ))}
                </>
              ))
            ) : (
              (processedData as Transaction[]).map((t, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-700">{t.merchant}</td>
                  <td className="px-4 py-3 text-gray-700">{t.date}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-700">
                    ${t.amount.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}