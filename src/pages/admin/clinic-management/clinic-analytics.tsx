import React from "react";
import { PageContainer } from "../../../components/animation";
import DatePicker from "antd/lib/date-picker";
// import Radio from "antd/lib/radio";
import Card from "../../../components/Card";
import "chart.js/auto";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";
import { Button } from "../../../components/Button";
import colors from "../../../../styles/theme";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Radio } from "../../../components/Radio";
import { Select } from "../../../components/Select";

import { numberSeparator } from "../../../../utils/helpers";
import PrivateRoute from "../../../auth/HOC/PrivateRoute";
import VerifyAuth from "../../../auth/HOC/VerifyAuth";
import { NextPageProps } from "../../../../utils/types/NextPageProps";
import { ScriptableContext } from "chart.js/auto";

const randomNumber = () => {
  return Math.random() * (100 - 1);
};

const dummyData = [
  {
    content: "102",
    description: "Total Number of Patient Records",
    lineData: {
      labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          backgroundColor: (context: ScriptableContext<"line">) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(35, 35, 35, 200);
            gradient.addColorStop(0, colors.primary["400"]);
            gradient.addColorStop(0.2, colors.primary["200"]);
            return gradient;
          },
          borderColor: colors.primary["500"],
          borderWidth: 2,
          tension: 0.2,
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
    description: "Total Patients Catered",
    lineData: {
      labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          backgroundColor: (context: ScriptableContext<"line">) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(35, 35, 35, 200);
            gradient.addColorStop(0, colors.secondary["400"]);
            gradient.addColorStop(0.2, colors.secondary["200"]);
            return gradient;
          },
          borderColor: colors.secondary["500"],
          borderWidth: 2,
          tension: 0.2,
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
    content: `₱ ${numberSeparator(25000)}`,
    description: "Revenue",
    lineData: {
      labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
        {
          backgroundColor: (context: ScriptableContext<"line">) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(35, 35, 35, 200);
            gradient.addColorStop(0, colors.blumine["400"]);
            gradient.addColorStop(0.2, colors.blumine["200"]);
            return gradient;
          },
          borderColor: colors.blumine["500"],
          borderWidth: 2,
          tension: 0.2,
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
      backgroundColor: (context: ScriptableContext<"line">) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(50, 50, 50, 200);
        gradient.addColorStop(0, colors.primary["500"]);
        gradient.addColorStop(1, colors.primary["200"]);
        return gradient;
      },
      borderColor: [colors.primary["400"]],
      borderWidth: 1,
    },
    {
      label: "Sample 2",
      data: [80, 70, 25, 55, 38, 65, 42, 55, 38, 65, 42, 55],
      backgroundColor: (context: ScriptableContext<"line">) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(50, 50, 50, 200);
        gradient.addColorStop(0, colors.secondary["500"]);
        gradient.addColorStop(1, colors.secondary["200"]);
        return gradient;
      },
      borderColor: [colors.secondary["400"]],
      borderWidth: 1,
    },
  ],
};

const doughnutData = {
  labels: ["Male", "Female"],
  datasets: [
    {
      data: [65, 30],
      backgroundColor: (context: ScriptableContext<"line">) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(20, 20, 20, 100);
        const gradient2 = ctx.createLinearGradient(20, 20, 20, 100);
        gradient.addColorStop(0, colors.secondary["500"]);
        gradient.addColorStop(1, colors.secondary["200"]);
        gradient2.addColorStop(0, colors.primary["500"]);
        gradient2.addColorStop(1, colors.primary["200"]);
        return [gradient, gradient2];
      },
      borderColor: [colors.secondary["400"], colors.primary["400"]],
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

export function ClinicAnalytics({}: NextPageProps) {
  return (
    <PageContainer>
      <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
        <h3 className="basis-auto whitespace-nowrap">Clinic Analytics</h3>
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-center md:basis-auto basis-full">
          <Select placeholder="Select Doctor" className="border-transparent">
            {fakeDoctors.map(({ name }, index) => {
              return (
                <Select.Option value={name} key={index}>
                  {name}
                </Select.Option>
              );
            })}
          </Select>
          <Select placeholder="Select Branch" className="border-transparent">
            {fakeBranches.map(({ name }, index) => {
              return (
                <Select.Option value={name} key={index}>
                  {name}
                </Select.Option>
              );
            })}
          </Select>
          <DatePicker getPopupContainer={(triggerNode: any) => {
                    return triggerNode.parentNode;
                  }}.RangePicker className="[&.ant-picker]:border-transparent" />
        </div> */}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {dummyData.map(
          ({ content, description, lineData, percentage, rate }, index) => {
            return (
              <Card
                key={index}
                className="text-center space-y-1 pb-16 z-[1] overflow-hidden justify-center items-center flex flex-col"
              >
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
                <div className="absolute bottom-0 inset-x-0 h-1/2 pointer-events-none -z-[1]">
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
                      layout: {
                        padding: -10,
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
          <h5>Total Clinic Revenue</h5>
          <Radio.Group
            onChange={(e: string) => console.log(e)}
            defaultValue="monthly"
            className="max-w-md"
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
        <Card className="space-y-6 col-span-10 lg:col-span-6">
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
        <Card className="space-y-6 col-span-10 lg:col-span-4">
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
        <Card className="space-y-6 col-span-10 lg:col-span-6">
          <div className="flex flex-col justify-between items-center space-y-6 xs:flex-row xs:space-y-0">
            <h5>Location</h5>
            <Radio.Group
              onChange={(e: string) => console.log(e)}
              defaultValue="country"
              className="max-w-sm"
            >
              <Radio.Button value="country" label="Country" />
              <Radio.Button value="city" label="City" />
            </Radio.Group>
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
        <Card className="space-y-6 col-span-10 lg:col-span-4">
          <div className="flex flex-col justify-between items-center space-y-6">
            <h5>Most Users</h5>
            <Radio.Group
              onChange={(e: string) => console.log(e)}
              className="max-w-sm"
            >
              <Radio.Button value="active" label="Active" />
              <Radio.Button value="inactive" label="Inactive" />
            </Radio.Group>
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

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(ClinicAnalytics);
