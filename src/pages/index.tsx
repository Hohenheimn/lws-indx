import React from "react";
import { PageContainer } from "../components/animation";
import DatePicker from "antd/lib/date-picker";
// import Radio from "antd/lib/radio";
import Card from "../components/Card";
import "chart.js/auto";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";
import { Button } from "../components/Button";
import colors from "../../styles/theme";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Radio } from "../components/Radio";

const randomNumber = () => {
  return Math.random() * (100 - 1);
};

const dummyData = [
  {
    content: "102",
    description: "Total Registered Users",
    lineData: {
      labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          backgroundColor: colors.orange[50],
          borderColor: colors.orange[300],
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          data: [
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomNumber(),
          ],
        },
      ],
    },
    percentage: 60.2,
    rate: "up",
  },
  {
    content: "75",
    description: "Total Paid Subscribers",
    lineData: {
      labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          backgroundColor: colors.cyan[50],
          borderColor: colors.cyan[300],
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          data: [
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomNumber(),
          ],
        },
      ],
    },
    percentage: 57.4,
    rate: "down",
  },
  {
    content: "329",
    description: "Total Patient Records",
    lineData: {
      labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          backgroundColor: colors.emerald[50],
          borderColor: colors.emerald[300],
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          data: [
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomNumber(),
          ],
        },
      ],
    },
    percentage: 22.1,
    rate: "up",
  },
  {
    content: "10",
    description: "Total Cancelled Subscribers",
    lineData: {
      labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          backgroundColor: colors.fuchsia[50],
          borderColor: colors.fuchsia[300],
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          data: [
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomNumber(),
            randomNumber(),
          ],
        },
      ],
    },
    percentage: 33.8,
    rate: "up",
  },
];

const chartData = {
  labels: [
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
  datasets: [
    {
      label: "Sample 1",
      data: [65, 59, 80, 81, 56, 55, 40, 80, 81, 56, 55, 40],
      backgroundColor: [colors.primary[500]],
      borderColor: ["transparent"],
      borderWidth: 1,
    },
    {
      label: "Sample 2",
      data: [80, 70, 25, 55, 38, 65, 42, 55, 38, 65, 42, 55],
      backgroundColor: [colors.secondary[500]],
      borderColor: ["transparent"],
      borderWidth: 1,
    },
  ],
};

const doughnutData = {
  labels: ["Male", "Female"],
  datasets: [
    {
      data: [65, 30],
      backgroundColor: [colors.primary[500], colors.secondary[500]],
      borderColor: [colors.primary[500], colors.secondary[500]],
      hoverOffset: 15,
    },
  ],
};

const pieData = {
  labels: [
    "18 - 25 Years Old",
    "26 - 30 Years Old",
    "31 - 35 Years Old",
    "36 - 40 Years Old",
    "41 - 45 Years Old",
    "46 - 50 Years Old",
  ],
  datasets: [
    {
      data: [23, 30, 5, 18, 9, 15],
      backgroundColor: [
        colors.primary[600],
        colors.primary[500],
        colors.primary[400],
        colors.primary[300],
        colors.primary[200],
        colors.primary[100],
      ],
      borderColor: [
        colors.primary[600],
        colors.primary[500],
        colors.primary[400],
        colors.primary[300],
        colors.primary[200],
        colors.primary[100],
      ],
      hoverOffset: 15,
    },
  ],
};

const locationData = {
  labels: [
    "Asia",
    "Africa",
    "Europe",
    "South America",
    "North America",
    "Autralia",
    "Autralia",
    "Autralia",
    "Autralia",
    "Autralia",
  ],
  datasets: [
    {
      label: "Sample 1",
      data: [65, 59, 80, 81, 56, 55, 40, 80, 81, 56],
      backgroundColor: [colors.primary[500]],
      borderColor: ["transparent"],
      borderWidth: 1,
      barPercentage: 1.06,
    },
    {
      label: "Sample 2",
      data: [80, 70, 25, 55, 38, 65, 42, 55, 38, 65],
      backgroundColor: [colors.secondary[500]],
      borderColor: ["transparent"],
      borderWidth: 1,
      barPercentage: 1.06,
    },
  ],
};

const userData = [
  "Angelina Jolie",
  "Anne Hathaway",
  "Liam Neson",
  "Andrew Garfield",
  "Gerald Anderson",
];

export default function Dashboard() {
  return (
    <PageContainer>
      <div className="flex justify-between align-middle">
        <h3>Dashboard</h3>
        <div>
          <DatePicker.RangePicker />
        </div>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6">
        {dummyData.map(
          ({ content, description, lineData, percentage, rate }, index) => {
            return (
              <Card key={index} className="text-center space-y-1 pb-10 z-[1]">
                <h4>{content}</h4>
                <div className="text-base max-w-[8rem] m-auto font-medium">
                  {description}
                </div>
                <p
                  className={`${
                    rate === "up" ? "text-green-500" : "text-red-500"
                  } text-xs  leading-tight`}
                >
                  {rate === "up" ? "▲" : "▼"} {percentage}%
                </p>
                <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none -z-[1]">
                  <Line
                    data={lineData}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      tooltips: {
                        enabled: false,
                      },
                      elements: {
                        point: {
                          radius: 0,
                        },
                      },
                      scales: {
                        x: {
                          scaleLabel: false,
                          ticks: {
                            display: false,
                          },
                          grid: {
                            drawBorder: false,
                            display: false,
                            ticks: false,
                          },
                        },
                        y: {
                          scaleLabel: false,
                          ticks: {
                            display: false,
                          },
                          grid: { drawBorder: false, display: false },
                        },
                      },
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </Card>
            );
          }
        )}
      </div>
      <Card className="space-y-6">
        <div className="flex flex-col justify-between items-center space-y-6 xs:flex-row xs:space-y-0">
          <h5>Total Revenue</h5>
          <Radio.Group
            onChange={(e: string) => console.log(e)}
            className="flex items-center justify-center [&_button]:rounded-none [&_button]:first:[&>div]:rounded-tl-md [&_button]:first:[&>div]:rounded-bl-md [&_button]:last:[&>div]:rounded-tr-md [&_button]:last:[&>div]:rounded-br-md"
          >
            <Radio.Button value="daily" label="Daily" />
            <Radio.Button value="monthly" label="Monthly" />
            <Radio.Button value="yearly" label="Yearly" />
          </Radio.Group>
        </div>
        <div className="h-[25rem] w-full">
          <Bar
            data={chartData}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  grid: {
                    display: true,
                  },
                },
              },
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </Card>
      <div className="grid grid-cols-10 gap-8">
        <Card className="space-y-6 col-span-6">
          <div className="flex flex-col justify-between items-center space-y-6 xs:flex-row xs:space-y-0">
            <h5>Male vs Female</h5>
          </div>
          <div className="h-[25rem] w-full">
            <Doughnut
              data={doughnutData}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                    fullSize: true,
                    labels: {
                      boxWidth: 10,
                      boxHeight: 10,
                      padding: 50,
                    },
                  },
                },
                cutout: "85%",
                layout: { padding: 15 },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </Card>
        <Card className="space-y-6 col-span-4">
          <div className="flex flex-col justify-between items-center space-y-6 xs:flex-row xs:space-y-0">
            <h5>Age</h5>
          </div>
          <div className="h-[25rem] w-full">
            <Pie
              data={pieData}
              plugins={[ChartDataLabels]}
              options={{
                plugins: {
                  datalabels: {
                    anchor: "end",
                    align: "end",
                    formatter: (
                      value: number,
                      ctx: { chart: { data: { datasets: { data: any }[] } } }
                    ) => {
                      const datapoints = ctx.chart.data.datasets[0].data;
                      const total = datapoints.reduce(
                        (total: any, datapoint: any) => total + datapoint,
                        0
                      );
                      const percentage = (value / total) * 100;
                      return percentage.toFixed(2) + "%";
                    },
                    color: "#000",
                    font: {
                      weight: 600,
                    },
                  },
                  legend: {
                    position: "bottom",
                    fullSize: true,
                    labels: {
                      boxWidth: 10,
                      boxHeight: 10,
                      padding: 50,
                    },
                  },
                },
                layout: { padding: 15 },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </Card>
        <Card className="space-y-6 col-span-6">
          <div className="flex flex-col justify-between items-center space-y-6 xs:flex-row xs:space-y-0">
            <h5>Location</h5>
            <div className="flex items-center justify-center space-x-5">
              <Button>Country</Button>
              <Button>City</Button>
            </div>
          </div>
          <div className="h-[25rem] w-full">
            <Bar
              data={locationData}
              options={{
                plugins: {
                  legend: {
                    position: "top",
                    fullSize: true,
                    labels: {
                      usePointStyle: true,
                      boxWidth: 10,
                      boxHeight: 10,
                      padding: 50,
                    },
                  },
                },
                scales: {
                  x: {
                    grid: {
                      drawBorder: false,
                      display: false,
                    },
                  },
                  y: {
                    grid: {
                      drawBorder: false,
                      display: true,
                    },
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </Card>
        <Card className="space-y-6 col-span-4">
          <div className="flex flex-col justify-between items-center space-y-6">
            <h5>Most Users</h5>
            <div className="flex items-center justify-center space-x-5">
              <Button>Active</Button>
              <Button>Inactive</Button>
            </div>
            <div>
              {userData.map((user, index) => {
                return (
                  <div key={index} className="text-base">
                    {user}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
