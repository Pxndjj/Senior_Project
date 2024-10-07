"use client";
import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import ReactApexChart from "react-apexcharts";

const months = [
  { value: 1, name: "January" },
  { value: 2, name: "February" },
  { value: 3, name: "March" },
  { value: 4, name: "April" },
  { value: 5, name: "May" },
  { value: 6, name: "June" },
  { value: 7, name: "July" },
  { value: 8, name: "August" },
  { value: 9, name: "September" },
  { value: 10, name: "October" },
  { value: 11, name: "November" },
  { value: 12, name: "December" },
];

const ApexChart = ({ data }) => {
  const availableYears = [
    ...new Set(
      data.map((item) => {
        const year = new Date(item.queue_date).getFullYear();
        return isNaN(year) ? new Date().getFullYear() : year;
      })
    ),
  ];

  const [series, setSeries] = useState([]);
  const [options, setOptions] = useState({
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: { categories: [] },
    fill: { opacity: 1 },
    tooltip: { y: { formatter: (val) => val + " bookings" } },
  });
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(
    availableYears[0] || new Date().getFullYear()
  );
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const processData = (data, period) => {
    let groupedData = {};
    let categories = [];
    let tempSeries = [
      { name: "Waiting", data: [] },
      { name: "Confirm", data: [] },
      { name: "Succeed", data: [] },
      { name: "Cancel", data: [] },
    ];

    if (period === "week" || period === "month") {
      data = data.filter((item) => {
        const itemDate = new Date(item.queue_date);
        const itemMonth = itemDate.getMonth() + 1;
        const itemYear = itemDate.getFullYear();
        return (
          (period === "week" && itemMonth === selectedMonth && itemYear === selectedYear) ||
          (period === "month" && itemYear === selectedYear)
        );
      });
    }

    data.forEach((item) => {
      let key;
      if (period === "week") {
        const weekNumber = Math.ceil(new Date(item.queue_date).getDate() / 7);
        key = `Week ${weekNumber}`;
      } else if (period === "month") {
        key = new Date(item.queue_date).toLocaleDateString("en-US", { month: "short" });
      } else if (period === "year") {
        key = new Date(item.queue_date).getFullYear();
      }

      if (!groupedData[key]) {
        groupedData[key] = { W: 0, C: 0, S: 0, X: 0 };
      }

      groupedData[key][item.queue_status]++;
    });

    categories = Object.keys(groupedData).sort((a, b) => {
      if (period === "week") return parseInt(a.split(" ")[1]) - parseInt(b.split(" ")[1]);
      else if (period === "month") return new Date(`01 ${a} 2000`) - new Date(`01 ${b} 2000`);
      else return a - b;
    });

    tempSeries[0].data = categories.map((key) => groupedData[key].W);
    tempSeries[1].data = categories.map((key) => groupedData[key].C);
    tempSeries[2].data = categories.map((key) => groupedData[key].S);
    tempSeries[3].data = categories.map((key) => groupedData[key].X);

    return { tempSeries, categories };
  };

  const updateChartData = (period) => {
    setLoading(true);
    setProgress(0);

    const { tempSeries, categories } = processData(data, period);

    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval);
          setLoading(false);
          setSeries(tempSeries);
          setOptions((prevOptions) => ({
            ...prevOptions,
            xaxis: { categories: categories },
          }));
          return 100;
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 100);
  };

  useEffect(() => {
    updateChartData(selectedPeriod);
  }, [selectedPeriod, selectedMonth, selectedYear]);

  const handlePeriodChange = (keys) => {
    const key = Array.from(keys)[0];
    setSelectedPeriod(key);
    updateChartData(key);
  };

  const handleMonthChange = (keys) => {
    const key = Array.from(keys)[0];
    setSelectedMonth(parseInt(key));
    updateChartData("month");
  };

  const handleYearChange = (keys) => {
    const key = Array.from(keys)[0];
    setSelectedYear(parseInt(key));
    updateChartData(selectedPeriod);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="w-[100%]">
          <h2>Booking Overview</h2>
        </div>

        <div className="flex space-x-4">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered" className="capitalize">
                {selectedPeriod}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Select Period"
              variant="flat"
              disallowEmptySelection
              selectionMode="single"
              selectedKeys={new Set([selectedPeriod])}
              onSelectionChange={handlePeriodChange}
            >
              <DropdownItem key="week">Week</DropdownItem>
              <DropdownItem key="month">Month</DropdownItem>
              <DropdownItem key="year">Year</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {(selectedPeriod !== "year" && selectedPeriod !== "month") && (
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" className="capitalize">
                  {months.find((m) => m.value === selectedMonth)?.name || "Select Month"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select Month"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={new Set([selectedMonth.toString()])}
                onSelectionChange={handleMonthChange}
              >
                {months.map((month) => (
                  <DropdownItem key={month.value.toString()}>{month.name}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}

          {selectedPeriod !== "year" && (
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered" className="capitalize">
                  {selectedYear || "Select Year"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Select Year"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={new Set([selectedYear.toString()])}
                onSelectionChange={handleYearChange}
              >
                {availableYears.map((year) => (
                  <DropdownItem key={year.toString()}>{year}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center mt-6 relative">
          <div className="w-24 h-24 border-4 border-gray-200 border-t-blue-500 border-solid rounded-full animate-spin"></div>
          <div className="absolute text-blue-500 text-lg font-semibold">
            {progress}%
          </div>
        </div>
      ) : (
        <div id="chart">
          <ReactApexChart options={options} series={series} type="bar" height={350} />
        </div>
      )}
    </div>
  );
};

export default ApexChart;
