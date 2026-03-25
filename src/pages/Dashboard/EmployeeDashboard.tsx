import React from "react";
import PageMeta from "../../components/common/PageMeta";
import EmployeeWelcome from "../../components/employee-portal/EmployeeWelcome";
import MyAttendance from "../../components/employee-portal/MyAttendance";
import LeaveOverview from "../../components/employee-portal/LeaveOverview";
import UpcomingEvents from "../../components/employee-portal/UpcomingEvents";

export default function EmployeeDashboard() {
  return (
    <>
      <PageMeta
        title="My Portal | TailAdmin - React.js Admin Dashboard Template"
        description="This is the individual Employee Portal for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Welcome Section spans entire width */}
        <div className="col-span-12">
          <EmployeeWelcome />
        </div>

        {/* Dashboard Widgets Row */}
        <div className="col-span-12 lg:col-span-4 max-w-full">
          <MyAttendance />
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-4 max-w-full">
          <LeaveOverview />
        </div>

        <div className="col-span-12 md:col-span-6 lg:col-span-4 max-w-full">
          <UpcomingEvents />
        </div>
      </div>
    </>
  );
}
