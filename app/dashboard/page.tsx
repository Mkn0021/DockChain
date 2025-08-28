"use client";
import React, { useEffect, useState } from "react";
import { useAlert } from "@/components/providers/AlertProvider";
import type { DashboardStats } from "@/app/api/dashboard/route";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) showAlert('Failed to fetch dashboard stats', 'error');
        const response: { data: DashboardStats } = await res.json();
        setStats(response.data);
      } catch {
        showAlert('Error occured fetching dashboard stats', 'error');
      }
    }
    fetchStats();
  }, []);

  const items = [
    { title: 'Templates', value: stats?.templates ?? 0 },
    { title: 'Documents', value: stats?.documents ?? 0 },
    { title: 'Status', value: stats?.status ?? "Disconnected" },
  ];

  return (
    <div className="grid grid-cols-3 w-full border border-border">
      {items.map((item, index) => (
        <div key={item.title} className="flex items-center">
          {/* Add separator on left side of middle item */}
          {index === 1 && (
            <div className="w-px h-full bg-border"></div>
          )}
          <div className="flex-1 gap-6 px-6 py-6 md:py-10 md:px-12 xl:px-16">
            <h4 className="text-xs md:text-base m-0 p-0">{item.title}</h4>
            <p className="text-lg md:text-2xl xl:text-3xl text-text-feature">{item.value}</p>
          </div>
          {/* Add separator on right side of middle item */}
          {index === 1 && (
            <div className="w-px h-full bg-border"></div>
          )}
        </div>
      ))}
    </div>
  );
}
