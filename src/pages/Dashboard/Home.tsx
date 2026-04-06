import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import MonthlyExpenseTracker from "../../components/ecommerce/MonthlyExpenseTracker";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import PageMeta from "../../components/common/PageMeta";
import { DashboardProvider } from "../../context/DashboardContext";

export default function Home() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <DashboardProvider>
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 xl:col-span-8">
            <EcommerceMetrics />
          </div>

          <div className="col-span-12 xl:col-span-4">
            <MonthlyTarget />
          </div>

          <div className="col-span-12 space-y-6">
            <MonthlySalesChart />
            <MonthlyExpenseTracker />
          </div>
        </div>
      </DashboardProvider>
    </>
  );
}

