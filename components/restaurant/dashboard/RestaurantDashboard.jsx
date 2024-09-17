"use client";
import ApexChart from "@/components/restaurant/chart/ApexChart.jsx";

export default function RestaurantDashboard({ data }) {
  const statusCounts = {
    Waiting: data.filter(item => item.queue_status === "W").length,
    Confirm: data.filter(item => item.queue_status === "C").length,
    Succeed: data.filter(item => item.queue_status === "S").length,
    Cancel: data.filter(item => item.queue_status === "X").length,
  };

  const totalQueues =
    statusCounts.Waiting +
    statusCounts.Confirm +
    statusCounts.Succeed +
    statusCounts.Cancel;

  const statusPercentages = {
    Waiting: ((statusCounts.Waiting / totalQueues) * 100).toFixed(1),
    Confirm: ((statusCounts.Confirm / totalQueues) * 100).toFixed(1),
    Succeed: ((statusCounts.Succeed / totalQueues) * 100).toFixed(1),
    Cancel: ((statusCounts.Cancel / totalQueues) * 100).toFixed(1),
  };

  const calculateDashOffset = (percentage) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    return circumference - (percentage / 100) * circumference;
  };

  return (
    <>
      <div className="analyse flex flex-wrap gap-4">
        {Object.entries(statusCounts).map(([status, count], index) => {
          const colorClasses = {
            Waiting: "text-yellow-500",
            Confirm: "text-green-500",
            Succeed: "text-gray-500",
            Cancel: "text-red-500",
          };

          const statusName = {
            Waiting: "Waiting",
            Confirm: "Confirm",
            Succeed: "Succeed",
            Cancel: "Cancel",
          };

          return (
            <div key={index} className="flex-1 p-4 bg-white shadow-md rounded-lg">
              <div className="status flex items-center justify-between">
                <div className="info">
                  <h3 className="text-lg font-semibold">{statusName[status]}</h3>
                  <h1 className="text-2xl">{count}</h1>
                </div>
                <div className="progresss relative">
                  <svg className="w-16 h-16">
                    <circle
                      cx="38"
                      cy="38"
                      r="36"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray="226.2"
                      strokeDashoffset={calculateDashOffset(statusPercentages[status])}
                      className={`${colorClasses[status]}`}
                      fill="none"
                    ></circle>
                  </svg>
                  <div className="percentage absolute inset-0 flex items-center justify-center">
                    <p className={`${colorClasses[status]}`}>{statusPercentages[status]}%</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="chart mt-6">
        <ApexChart data={data}/>
      </div>
    </>
  );
}
