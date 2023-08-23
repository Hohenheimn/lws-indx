import React, { useState } from "react";
import { Table } from "antd";
import { IoIosArrowForward } from "react-icons/io";
import Card from "@src/components/Card";
import { numberSeparator } from "@utilities/helpers";

type Props = {
  onBack: () => void;
};

const sampleData = [
  {
    created_at: "05/01/21",
    account_type: "Basic",
    service_period: "05/01/21 - 05/01/21",
    payment_method: "Credit Card",
    amount: 1000,
  },
];
const columns: any = [
  {
    title: "Payment Date",
    dataIndex: "created_at",
    width: "10rem",
    align: "center",
  },
  {
    title: "Account Type",
    dataIndex: "account_type",
    width: "10rem",
    align: "center",
  },
  {
    title: "Service Period",
    dataIndex: "service_period",
    width: "10rem",
    align: "center",
  },
  {
    title: "Payment Method",
    dataIndex: "payment_method",
    width: "10rem",
    align: "center",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    width: "10rem",
    align: "center",
    render: (amount: number) => <p>{numberSeparator(amount, 2)}</p>,
  },
];

export default function BillingDetails({ onBack }: Props) {
  const [page, setPage] = useState(1);
  return (
    <>
      <Table
        rowKey="_id"
        columns={columns}
        // dataSource={charting?.data}
        dataSource={sampleData}
        showHeader={true}
        tableLayout="fixed"
        // loading={chartingIsLoading}
        title={() => (
          <div className="space-y-4 md:p-12 p-6 !pb-0">
            <h4 className="mb-3">Billing Details</h4>
            <ul className=" flex space-x-3 items-center">
              <li className=" cursor-pointer" onClick={onBack}>
                Account Details
              </li>
              <li>
                <IoIosArrowForward />
              </li>
              <li className=" text-primary-500 cursor-pointer">
                Billing Details
              </li>
            </ul>
            <h4 className="basis-full md:basis-auto">Account Type: Basic</h4>
            <h4 className="basis-full md:basis-auto">
              Next Billing Date: May 15 2021
            </h4>
          </div>
        )}
        pagination={{
          pageSize: 5,
          hideOnSinglePage: true,
          showSizeChanger: false,
          // total: charting?.meta?.total,
          total: 1,
          onChange: (page: any) => setPage(page),
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
    </>
  );
}
