import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllEmployees } from "../features/users/employeeApi";
import { getAllProjects } from "../features/projects/projectAPI";
import { getAllRevenues } from "../features/revenue/revenueApi";
import { getAllExpenses } from "../features/expenses/expenseApi";
import { getMonthlyReport } from "../features/financial/financialApi";
import { Revenue, Expense, MonthlyReport } from "../types/apiTypes";

export interface DashboardData {
  totalEmployees: number;
  totalProjects: number;
  totalRevenue: number;
  totalExpense: number;
  totalProfit: number;
  monthlyRevenue: number[];
  monthlyExpense: number[];
  rawExpenses: Expense[];
  revenueGrowth: number;
  expenseGrowth: number;
  currentMonthlyReport?: MonthlyReport;
  previousMonthlyReport?: MonthlyReport;
  loading: boolean;
}

const DashboardContext = createContext<DashboardData | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DashboardData>({
    totalEmployees: 0,
    totalProjects: 0,
    totalRevenue: 0,
    totalExpense: 0,
    totalProfit: 0,
    monthlyRevenue: new Array(12).fill(0),
    monthlyExpense: new Array(12).fill(0),
    rawExpenses: [],
    revenueGrowth: 0,
    expenseGrowth: 0,
    currentMonthlyReport: undefined,
    previousMonthlyReport: undefined,
    loading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // API expects 1-indexed
        const currentYear = now.getFullYear();
        
        const lastMonthDate = new Date(now);
        lastMonthDate.setMonth(now.getMonth() - 1);
        const lastMonth = lastMonthDate.getMonth() + 1;
        const lastYear = lastMonthDate.getFullYear();

        const [empRes, projRes, revRes, expRes, currentReportRes, previousReportRes]: any = await Promise.all([
          getAllEmployees(),
          getAllProjects(),
          getAllRevenues(),
          getAllExpenses(),
          getMonthlyReport(currentMonth, currentYear),
          getMonthlyReport(lastMonth, lastYear),
        ]);

        // Normalize response structures
        const employees = Array.isArray(empRes) ? empRes : empRes?.data || [];
        const projects = Array.isArray(projRes) ? projRes : projRes?.data || [];
        const revenues = Array.isArray(revRes) ? revRes : revRes?.data || [];
        const rawExpenses = Array.isArray(expRes) ? expRes : expRes?.data || [];
        const currentMonthlyReport = (currentReportRes as any)?.data || (currentReportRes as MonthlyReport);
        const previousMonthlyReport = (previousReportRes as any)?.data || (previousReportRes as MonthlyReport);

        // Current totals
        const totalEmployees = employees.length;
        const totalProjects = projects.length;
        
        // Calculate monthly totals
        const revMonthly = new Array(12).fill(0);
        const expMonthly = new Array(12).fill(0);
        
        revenues.forEach((r: Revenue) => {
          if (!r.date) return;
          const d = new Date(r.date);
          if (d.getFullYear() === currentYear) {
            revMonthly[d.getMonth()] += Number(r.amount) || 0;
          }
        });

        rawExpenses.forEach((e: Expense) => {
          if (e.year === currentYear && e.month) {
            expMonthly[e.month - 1] += Number(e.amount) || 0;
          } else if (e.expenseDate) {
             const d = new Date(e.expenseDate);
             if (d.getFullYear() === currentYear) {
                expMonthly[d.getMonth()] += Number(e.amount) || 0;
             }
          }
        });

        const totalRevenue = revMonthly.reduce((a, b) => a + b, 0);
        const totalExpense = expMonthly.reduce((a, b) => a + b, 0);
        const totalProfit = totalRevenue - totalExpense;
        
        const revGrowth = revMonthly[lastMonth - 1] > 0 
          ? ((revMonthly[currentMonth - 1] - revMonthly[lastMonth - 1]) / revMonthly[lastMonth - 1]) * 100 
          : 0;

        setData({
          totalEmployees,
          totalProjects,
          totalRevenue,
          totalExpense,
          totalProfit,
          monthlyRevenue: revMonthly,
          monthlyExpense: expMonthly,
          rawExpenses,
          revenueGrowth: Number(revGrowth.toFixed(1)),
          expenseGrowth: 0,
          currentMonthlyReport,
          previousMonthlyReport,
          loading: false,
        });
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
        setData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardContext.Provider value={data}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
