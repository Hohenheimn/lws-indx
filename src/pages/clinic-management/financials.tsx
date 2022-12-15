import React from "react";
import { PageContainer } from "../../components/animation";
import DatePicker from "antd/lib/date-picker";
// import Radio from "antd/lib/radio";
import Card from "../../components/Card";
import "chart.js/auto";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";
import { Button } from "../../components/Button";
import colors from "../../../styles/theme";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Radio } from "../../components/Radio";
import { Select } from "../../components/Select";
import fakeDoctors from "../../../utils/global-data/fakeDoctors";
import fakeBranches from "../../../utils/global-data/fakeBranches";
import { numberSeparator, paymentStatusPalette } from "../../../utils/helpers";
import PrivateRoute from "../../auth/HOC/PrivateRoute";
import VerifyAuth from "../../auth/HOC/VerifyAuth";
import Table from "antd/lib/table/Table";
import { AiOutlineSearch } from "react-icons/ai";
import Input from "../../components/Input";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import Image from "next/image";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { NextPageProps } from "../../../utils/types/NextPageProps";

const randomNumber = () => {
  return Math.random() * (100 - 1);
};

const dummyData = [
  {
    content: "102",
    description: "Total Clinic Revenue",
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
    description: "Mode of Payment",
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
    content: `₱ ${numberSeparator(25000)}`,
    description: "Total Pending Balances",
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
];

let fakeData = [
  {
    branch: "Branch 1",
    doctor: "Doctor 1",
    invoice_number: 1,
    date_created: new Date("11/22/2021"),
    amount: 20000,
    mode_of_payment: "Credit",
    payment_status: "pending",
  },
  {
    branch: "Branch 2",
    doctor: "Doctor 2",
    invoice_number: 2,
    date_created: new Date("12/22/2021"),
    amount: 20000,
    mode_of_payment: "Debit",
    payment_status: "paid",
  },
  {
    branch: "Branch 3",
    doctor: "Doctor 3",
    invoice_number: 3,
    date_created: new Date("01/22/2022"),
    amount: 20000,
    mode_of_payment: "GCash",
    payment_status: "partial payment",
  },
  {
    branch: "Branch 4",
    doctor: "Doctor 4",
    invoice_number: 4,
    date_created: new Date("02/22/2022"),
    amount: 20000,
    mode_of_payment: "Credit",
    payment_status: "pending",
  },
  {
    branch: "Branch 5",
    doctor: "Doctor 5",
    invoice_number: 5,
    date_created: new Date("03/22/2022"),
    amount: 20000,
    mode_of_payment: "Checque",
    payment_status: "pending",
  },
];

const columns: any = [
  {
    title: "Branch",
    dataIndex: "branch",
    width: "10rem",
    align: "center",
  },
  {
    title: "Assigned Doctor",
    dataIndex: "doctor",
    width: "10rem",
    align: "center",
  },
  {
    title: "Invoice Number",
    dataIndex: "invoice_number",
    width: "10rem",
    align: "center",
  },
  {
    title: "Date Created",
    dataIndex: "date_created",
    width: "15rem",
    align: "center",
    render: (date: Date) => format(date, "MMM dd, yyyy"),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    width: "10rem",
    align: "center",
    render: (amount: number) => `₱ ${numberSeparator(amount, 0)}`,
  },
  {
    title: "Mode of Payment",
    dataIndex: "mode_of_payment",
    width: "10rem",
    align: "center",
  },
  {
    title: "Payment Status",
    dataIndex: "payment_status",
    width: "10rem",
    align: "center",
    render: (status: string) => {
      return (
        <div className="px-2">
          <div
            className={twMerge(
              "capitalize rounded-full w-full flex justify-center items-center p-2 text-xs",
              paymentStatusPalette(status)
            )}
          >
            {status}
          </div>
        </div>
      );
    },
  },
];

export function Financials({}: NextPageProps) {
  return (
    <PageContainer>
      <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
        <h3 className="basis-auto whitespace-nowrap">Financials</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-center md:basis-auto basis-full">
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
          <DatePicker.RangePicker className="[&.ant-picker]:border-transparent" />
        </div>
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
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="basis-full lg:basis-1/2">
          <Input
            placeholder="Search"
            prefix={<AiOutlineSearch className="text-lg text-gray-300" />}
            className="rounded-full border-none text-lg"
          />
        </div>
        <div className="basis-full lg:basis-auto flex gap-4">
          <Select
            placeholder="View Payment Status"
            className="border-transparent"
          >
            <Select.Option value="pending" key="pending">
              Pending
            </Select.Option>
            <Select.Option value="paid" key="paid">
              Paid
            </Select.Option>
          </Select>
        </div>
      </div>
      <Table
        id="tab"
        rowKey="invoice_number"
        columns={columns}
        dataSource={fakeData}
        showHeader={true}
        tableLayout="fixed"
        pagination={{
          pageSize: 5,
          hideOnSinglePage: true,
          showSizeChanger: false,
        }}
      />
    </PageContainer>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(Financials);
