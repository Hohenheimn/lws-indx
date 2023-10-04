import React, { useEffect, useState } from "react";
import { Form, Table } from "antd";
import DatePicker from "antd/lib/date-picker";
// import Radio from "antd/lib/radio";
import "chart.js/auto";
import { ScriptableContext } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import PrivateRoute from "@auth/HOC/PrivateRoute";
import VerifyAuth from "@auth/HOC/VerifyAuth";
import { AnimateContainer, PageContainer } from "@components/animation";
import { fadeIn } from "@src/components/animation/animation";
import DoughnutChart from "@src/components/Charts/DounutChart";
import HorizontalProgressLine from "@src/components/Charts/HorizontalProgessLine";
import LineChart from "@src/components/Charts/LineChart";
import { InfiniteSelect } from "@src/components/InfiniteSelect";
import LoadingScreen from "@src/layout/LoadingScreen";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@utilities/api";
import { numberSeparator, paymentStatusPalette } from "@utilities/helpers";
import { NextPageProps } from "@utilities/types/NextPageProps";

export type topProcedures = {
  procedure_name: string;
  count: number;
};
export type patientByLocation = {
  _id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  city: string;
};

export type patientBalanceList = {
  _id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  birthdate: string;
  gender: string;
  email: string;
  landline_no: string;
  mobile_no: string;
  street: string;
  barangay: string;
  city: string;
  country: string;
  zip_code: string;
};

export type totalMonthlyRevenue = {
  label: "July 2023";
  count: 7;
};

export type clinic_analytics = {
  totalNoOfPatientRecord: number;
  revenue: number;
  totalVisits: {
    male: number;
    female: 1;
  };
  topProcedures: topProcedures[];
  patientByLocation: patientByLocation[];
  totalMonthlyRevenue: totalMonthlyRevenue[];
};

const { RangePicker } = DatePicker;

export function ClinicAnalytics({ profile }: any) {
  const columns: any = [
    {
      title: "Date Created",
      dataIndex: "created_at",
      width: "10rem",
      align: "center",
      render: (created_at: Date) => moment(created_at).format("MMMM DD, YYYY"),
    },
    {
      title: "Branch",
      dataIndex: "branch_name",
      width: "10rem",
      align: "center",
    },
    {
      title: "Procedure",
      dataIndex: "procedure_name",
      width: "10rem",
      align: "center",
    },
    // {
    //   title: "Charge",
    //   dataIndex: "charge",
    //   width: "10rem",
    //   align: "center",
    //   render: (amount: number) =>
    //     `${profile.setting.currency} ${numberSeparator(amount, 2)}`,
    // },
    {
      title: "Remaining Balance",
      dataIndex: "balance",
      width: "10rem",
      align: "center",
      render: (balance: number) =>
        `${profile.setting.currency} ${numberSeparator(balance, 2)}`,
    },
    {
      title: "Payment Status",
      dataIndex: "status",
      width: "10rem",
      align: "center",
      render: (status: string) => (
        <div
          className={twMerge(
            "capitalize rounded-full w-full flex justify-center items-center p-2 text-xs ",
            paymentStatusPalette(status === null ? "no payment" : status)
          )}
        >
          {status}
        </div>
      ),
    },
  ];
  const [FilterForm] = Form.useForm();

  const doctor_id = Form.useWatch("doctor_id", FilterForm);

  const branch_id = Form.useWatch("branch_id", FilterForm);

  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const handleDateChange = (dates: any, dateStrings: any) => {
    setDateRange({
      from: dateStrings[0],
      to: dateStrings[1],
    });
  };

  let [page, setPage] = React.useState(1);

  let { data, isLoading } = useQuery(
    [
      "clinic-analytics",
      branch_id,
      doctor_id,
      dateRange.from,
      dateRange.to,
      page,
    ],
    () =>
      fetchData({
        url: `/api/clinic-analytics?limit=5&page=${page}&doctor_id=${
          doctor_id ? doctor_id : ""
        }&branch_id=${branch_id ? branch_id : ""}&date_from=${
          dateRange.from
        }&date_to=${dateRange.to}`,
      })
  );

  let { data: patientBalanceList, isLoading: tableLoading } = useQuery(
    [
      "clinic-analytics-patient-balance-list",
      branch_id,
      doctor_id,
      dateRange.from,
      dateRange.to,
      page,
    ],
    () =>
      fetchData({
        url: `/api/clinic-analytics/patient-balance-list?limit=5&page=${page}&doctor_id=${
          doctor_id ? doctor_id : ""
        }&branch_id=${branch_id ? branch_id : ""}&date_from=${
          dateRange.from
        }&date_to=${dateRange.to}`,
      })
  );

  const clinicAnalytics: clinic_analytics = data;

  const patientBalanceData: patientBalanceList[] = patientBalanceList?.data;

  return (
    <PageContainer>
      {(isLoading || tableLoading) && (
        <AnimateContainer
          variants={fadeIn}
          rootMargin="0px"
          className="fixed h-screen w-full top-0 left-0 z-[9999] bg-black bg-opacity-80 flex justify-center items-center"
        >
          <LoadingScreen />
        </AnimateContainer>
      )}
      <div className="flex justify-between flex-col lg:flex-row items-center gap-4 flex-wrap md:flex-nowrap">
        <h3 className="w-full lg:w-auto mr-5">Clinic&nbsp;Analytics</h3>
        <Form
          form={FilterForm}
          layout="vertical"
          className="w-full flex justify-between flex-col lg:flex-row lg:space-x-1 space-y-3 lg:space-y-0"
        >
          <div className="flex space-x-5 lg:space-x-1 lg:w-auto  lg:space-y-0 w-full">
            <Form.Item
              label=""
              name="doctor_id"
              required={false}
              className="w-full lg:w-auto"
            >
              <InfiniteSelect
                placeholder="Select Doctor"
                id="doctor_id"
                api={`${process.env.REACT_APP_API_BASE_URL}/api/account?limit=3&for_dropdown=true&page=1`}
                queryKey={["doctor"]}
                displayValueKey="name"
                returnValueKey="_id"
              />
            </Form.Item>

            <Form.Item
              label=""
              name="branch_id"
              required={false}
              className="w-full lg:w-auto"
            >
              <InfiniteSelect
                placeholder="Select Branch"
                id="branch_id"
                api={`${process.env.REACT_APP_API_BASE_URL}/api/branch?limit=3&for_dropdown=true&page=1`}
                queryKey={["branch"]}
                displayValueKey="name"
                returnValueKey="_id"
              />
            </Form.Item>
          </div>
          <div className="w-full lg:w-auto">
            <RangePicker onChange={handleDateChange} format="YYYY-MM-DD" />
          </div>
        </Form>
      </div>

      <ul className="flex flex-wrap justify-between space-y-0">
        <li className=" w-full lg:w-[68%] flex flex-wrap justify-between">
          <div className="w-full aspect-[4/1] text-white relative overflow-hidden bg-[#27c5cc] mb-3 shadow-md rounded-lg p-5 flex flex-col justify-end items-start">
            <aside className=" aspect-square h-[150%] top-[-25%] right-4 absolute">
              <Image
                src={"/images/clinic-analytics-banner.png"}
                fill
                alt={""}
              />
            </aside>
            <h3 className=" text-white text-[1rem] lg:text-3xl">
              Good Day, Dr.{profile.last_name}
            </h3>
            <p className=" text-[1rem]">Have a Nice Day!</p>
          </div>
          <div className=" bg-white space-y-2 w-full lg:w-[49%] mb-3 lg:mb-0 p-3 lg:aspect-[3/1] shadow-md rounded-lg text-center flex flex-col justify-center items-center">
            <h3 className=" text-green-500 text-center ">
              {isNaN(clinicAnalytics?.totalNoOfPatientRecord)
                ? 0
                : numberSeparator(clinicAnalytics?.totalNoOfPatientRecord, 0)}
            </h3>
            <p className=" text-[1rem] text-center">
              Total Number of Patient Records
            </p>
          </div>

          <div className=" bg-white space-y-2 w-full lg:w-[49%] mb-3 lg:mb-0 p-3  lg:aspect-[3/1] shadow-md rounded-lg text-center flex flex-col justify-center items-center">
            <h3 className=" text-red-300 text-center">
              {profile.setting.currency}{" "}
              {isNaN(clinicAnalytics?.revenue)
                ? 0
                : numberSeparator(clinicAnalytics?.revenue, 0)}
            </h3>
            <p className=" text-[1rem] text-center">Clinic Revenue</p>
          </div>
        </li>

        <li className=" w-full lg:w-[30%] shadow-md rounded-lg p-5 space-y-3 flex flex-col justify-center bg-white">
          <h5>Clinic Visits</h5>
          <div className="space-y-1">
            <p>Total Visits</p>
            <h3>
              {isNaN(
                Number(clinicAnalytics?.totalVisits?.male) +
                  Number(clinicAnalytics?.totalVisits?.female)
              )
                ? 0
                : Number(clinicAnalytics?.totalVisits?.male) +
                  Number(clinicAnalytics?.totalVisits?.female)}
            </h3>
          </div>
          <div>
            <HorizontalProgressLine
              dataSet={[
                clinicAnalytics?.totalVisits?.male,
                clinicAnalytics?.totalVisits?.female,
              ]}
            />
          </div>
        </li>
      </ul>

      <ul className="flex flex-wrap justify-between space-y-0">
        <li className=" w-full lg:w-[68%] lg:mb-0 mb-3 flex flex-wrap justify-between">
          <div className="w-full bg-white shadow-md rounded-lg p-5 flex flex-col justify-end items-start">
            <h4 className=" mb-5">Total Clinic Revenue</h4>
            <LineChart dataSet={clinicAnalytics?.totalMonthlyRevenue} />
          </div>
        </li>

        <li className=" w-full lg:w-[30%] flex flex-wrap justify-between">
          <div className="w-full shadow-md rounded-lg bg-white mb-3 p-5  flex flex-col justify-center">
            <h4 className=" mb-5">Top Procedures Done</h4>
            <DoughnutChart
              topProcedures={
                clinicAnalytics?.topProcedures
                  ? clinicAnalytics?.topProcedures
                  : []
              }
            />
          </div>
          <div className="w-full bg-white shadow-md rounded-lg p-5 space-y-2 flex flex-col justify-center">
            <h4>Top Patient by Location</h4>
            <ul className=" space-y-2">
              {clinicAnalytics?.patientByLocation.map((item, index) => (
                <li
                  key={index}
                  className=" flex justify-between space-x-2 items-center"
                >
                  <div className=" flex space-x-1 items-center">
                    <aside className=" h-10 w-10 overflow-hidden rounded-full relative shadow-md">
                      <Image src="/images/default_dentist.png" fill alt={""} />
                    </aside>
                    <p>
                      {item.first_name} {item.middle_name} {item.last_name}
                    </p>
                  </div>
                  <p className=" pr-5">{item.city}</p>
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ul>
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={patientBalanceData}
        showHeader={true}
        tableLayout="fixed"
        loading={false}
        title={() => (
          <div className="space-y-4 md:p-12 p-6 !pb-0">
            <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
              <h4 className="basis-full md:basis-auto">Patient Balance List</h4>
            </div>
          </div>
        )}
        pagination={{
          pageSize: 5,
          hideOnSinglePage: true,
          showSizeChanger: false,
          total: patientBalanceList?.meta?.total,
          onChange: (page) => setPage(page),
        }}
        components={{
          table: ({ ...rest }: any) => {
            let tableFlexGrow = rest?.children[2]?.props?.data?.length / 5;
            // let tableFlexGrow = 1;
            return (
              <table
                {...rest}
                style={{
                  flex: `${tableFlexGrow ? tableFlexGrow : 1} 1 auto`,
                }}
              />
            );
          },
          body: {
            row: ({ ...rest }: any) => {
              return <tr {...rest} />;
            },
          },
        }}
        className="[&.ant-table]:!rounded-none"
      />
    </PageContainer>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(ClinicAnalytics);
