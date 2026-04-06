import { BoxIconLine, GroupIcon, ArrowUpIcon, ArrowDownIcon } from "../../icons";
import { useDashboardData } from "../../hooks/useDashboardData";
import Skeleton from "../ui/skeleton/Skeleton";
import { IndianRupee } from "lucide-react";
import { formatIndianNumber } from "../../components/form/IndianAmountInput";
import { useEffect, useState, useRef } from "react";

/**
 * A fast-ticking "digital clock" style number animator
 */
const AnimatedNumber = ({ value, className }: { value: number; className?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const duration = 1200; // 1.2 seconds for the "live" feel

  useEffect(() => {
    startTime.current = null;
    const initialValue = displayValue;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);

      // Easing function for a "smooth" digital settle
      const easeOutQuad = (t: number) => t * (2 - t);
      const current = initialValue + (value - initialValue) * easeOutQuad(progress);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span className={`${className} font-mono tabular-nums`}>₹{formatIndianNumber(Math.floor(displayValue))}</span>;
};

/**
 * Formats large figures into compact currency strings (e.g., ₹30.2M/₹3Cr)
 */
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 1,
    notation: value >= 1000 ? "compact" : "standard",
  }).format(value);
};

export default function EcommerceMetrics() {
  const { totalEmployees, totalProjects, totalRevenue, totalExpense, totalProfit, loading } = useDashboardData();

  return (
    <div className="flex flex-col gap-6">
      {/* <!-- Top Hero Section: Business Profit --> */}
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] border-b-8 border-b-blue-600 transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl dark:bg-blue-500/20">
              <IndianRupee className="text-blue-700 size-8 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Business Profit
              </p>
              <span className={`inline-flex mt-1 text-xs px-3 py-1 rounded-full font-bold border transition-all duration-300 ${totalProfit >= 0
                ? "bg-success-50 text-success-700 border-success-100 dark:bg-success-500/10 dark:text-success-400 dark:border-success-500/20"
                : "bg-error-50 text-error-700 border-error-100 dark:bg-error-500/10 dark:text-error-400 dark:border-error-500/20"
                }`}>
                {totalProfit >= 0 ? "Sustained Growth Engine" : "Strategic Resilience"}
              </span>
            </div>
          </div>

          <div className="text-center md:text-right">
            {loading ? (
              <Skeleton className="h-12 w-48" />
            ) : (
              <h2 className={`text-4xl md:text-5xl font-black tracking-tight ${totalProfit >= 0 ? "text-success-600 dark:text-success-500" : "text-error-600 dark:text-error-500"}`}>
                <AnimatedNumber value={totalProfit} />
              </h2>
            )}
            <p className="mt-2 text-sm text-gray-400 dark:text-gray-500 italic">
              Estimated total balance for this year
            </p>
          </div>
        </div>
      </div>

      {/* <!-- Secondary Grid: Detailed Metrics - Changed to 2x2 grid for 2-column layout --> */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {/* <!-- Metric Item: Revenue --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-center w-12 h-12 bg-success-50 rounded-xl dark:bg-success-500/10">
            <ArrowUpIcon className="text-success-600 size-6 dark:text-success-500 fill-current" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Revenue
              </span>
              {loading ? (
                <Skeleton className="mt-2 h-7 w-20" />
              ) : (
                <div className="flex flex-col gap-1">
                  <h4 className="mt-1 font-bold text-gray-800 text-lg xl:text-title-sm dark:text-white/90">
                    {formatCurrency(totalRevenue)}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-400 w-fit font-medium">
                    Healthy Flow
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* <!-- Metric Item: Expenses --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-center w-12 h-12 bg-error-50 rounded-xl dark:bg-error-500/10">
            <ArrowDownIcon className="text-error-600 size-6 dark:text-error-500 fill-current" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Expense
              </span>
              {loading ? (
                <Skeleton className="mt-2 h-7 w-20" />
              ) : (
                <div className="flex flex-col gap-1">
                  <h4 className="mt-1 font-bold text-gray-800 text-lg xl:text-title-sm dark:text-white/90">
                    {formatCurrency(totalExpense)}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-error-50 text-error-600 dark:bg-error-500/10 dark:text-error-400 w-fit font-medium">
                    Within Plan
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* <!-- Metric Item: Team --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Our Team
              </span>
              {loading ? (
                <Skeleton className="mt-2 h-7 w-16" />
              ) : (
                <div className="flex flex-col gap-1">
                  <h4 className="mt-1 font-bold text-gray-800 text-lg xl:text-title-sm dark:text-white/90">
                    {totalEmployees.toLocaleString()}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 w-fit font-medium">
                    Members
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* <!-- Metric Item: Projects --> */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Projects
              </span>
              {loading ? (
                <Skeleton className="mt-2 h-7 w-16" />
              ) : (
                <div className="flex flex-col gap-1">
                  <h4 className="mt-1 font-bold text-gray-800 text-lg xl:text-title-sm dark:text-white/90">
                    {totalProjects.toLocaleString()}
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 w-fit font-medium">
                    Ongoing
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}







