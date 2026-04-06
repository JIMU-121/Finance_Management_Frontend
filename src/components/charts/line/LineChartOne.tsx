import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDashboardData } from "../../../hooks/useDashboardData";

interface LineChartProps {
  activeTab?: string;
}

export default function LineChartOne({ activeTab = "Overview" }: LineChartProps) {
  const options: ApexOptions = {
    legend: {
      show: true, // Hide legend
      position: "top",
      horizontalAlign: "left",
    },
    colors:
      activeTab === "Overview"
        ? ["#10B981", "#EF4444"]
        : activeTab === "Expense"
          ? ["#EF4444"]
          : ["#10B981"], // Dynamic colors based on active tab
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line", // Set the chart type to 'line'
      toolbar: {
        show: false, // Hide chart toolbar
      },
    },
    stroke: {
      curve: "smooth", // Smooth curves like the mockup
      width: [2, 2], // Line width
    },

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.15,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    markers: {
      size: 0, // Size of the marker points
      strokeColors: "#fff", // Marker border color
      strokeWidth: 2,
      hover: {
        size: 6, // Marker size on hover
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false, // Hide grid lines on x-axis
        },
      },
      yaxis: {
        lines: {
          show: true, // Show grid lines on y-axis
        },
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    tooltip: {
      enabled: true, // Enable tooltip
      x: {
        format: "dd MMM yyyy", // Format for x-axis tooltip
      },
    },
    xaxis: {
      type: "category", // Category-based x-axis
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: {
        show: false, // Hide x-axis border
      },
      axisTicks: {
        show: false, // Hide x-axis ticks
      },
      tooltip: {
        enabled: false, // Disable tooltip for x-axis points
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px", // Adjust font size for y-axis labels
          colors: ["#6B7280"], // Color of the labels
        },
      },
      title: {
        text: "", // Remove y-axis title
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const { monthlyRevenue, monthlyExpense } = useDashboardData();

  const series = [
    {
      name: "Revenue",
      data: monthlyRevenue,
    },
    {
      name: "Expense",
      data: monthlyExpense,
    },
  ].filter(s => {
    if (activeTab === "Overview") return true;
    if (activeTab === "Expense") return s.name === "Expense";
    if (activeTab === "Revenue") return s.name === "Revenue";
    return true;
  });
  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartEight" className="min-w-[1000px]">
        <Chart options={options} series={series} type="area" height={310} />
      </div>
    </div>
  );
}
