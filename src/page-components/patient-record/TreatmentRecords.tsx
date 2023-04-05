import { Checkbox, DatePicker, Form, Popover, Table } from "antd";
import React from "react";
import { scroller } from "react-scroll";
import { Button } from "../../components/Button";
import Card from "../../components/Card";
import Input from "../../components/Input";
import { Select } from "../../components/Select";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { numberSeparator, paymentStatusPalette } from "../../../utils/helpers";
import { twMerge } from "tailwind-merge";
import { NextPageProps } from "../../../utils/types/NextPageProps";

let fakeData = [
  {
    id: 1,
    invoice_number: "Inv-001",
    date_created: "01/02/2022",
    total_amount: 1000,
    mode_of_payment: "GCash",
    payment_status: "pending",
  },
  {
    id: 2,
    invoice_number: "Inv-002",
    date_created: "01/02/2022",
    total_amount: 1000,
    mode_of_payment: "GCash",
    payment_status: "partial payment",
  },
  {
    id: 3,
    invoice_number: "Inv-003",
    date_created: "01/02/2022",
    total_amount: 1000,
    mode_of_payment: "GCash",
    payment_status: "pending",
  },
  {
    id: 4,
    invoice_number: "Inv-004",
    date_created: "01/02/2022",
    total_amount: 1000,
    mode_of_payment: "GCash",
    payment_status: "paid",
  },
  {
    id: 5,
    invoice_number: "Inv-005",
    date_created: "01/02/2022",
    total_amount: 1000,
    mode_of_payment: "GCash",
    payment_status: "pending",
  },
];

const columns: any = [
  {
    title: "Invoice Number",
    dataIndex: "invoice_number",
    width: "10rem",
    align: "center",
  },
  {
    title: "Date Created",
    dataIndex: "date_created",
    width: "10rem",
    align: "center",
  },
  {
    title: "Amount",
    dataIndex: "total_amount",
    width: "10rem",
    align: "center",
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
    render: (status: string) => (
      <div
        className={twMerge(
          "capitalize rounded-full w-full flex justify-center items-center p-2 text-xs",
          paymentStatusPalette(status)
        )}
      >
        {status}
      </div>
    ),
  },
];

export function TreatmentRecords({ patientRecord }: any) {
  let [search, setSearch] = React.useState("");
  return (
    <Card className="flex-auto p-0">
      <div className="space-y-8 h-full flex flex-col">
        <div className="space-y-4 md:p-12 p-6 !pb-0">
          <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
            <h4 className="basis-full md:basis-auto">Treatment Records</h4>
          </div>
          <div className="flex justify-between align-middle gap-4">
            <div className="basis-1/2">
              <Input
                placeholder="Search"
                prefix={<AiOutlineSearch className="text-lg text-casper-500" />}
                className="rounded-full text-base shadow-none"
                onChange={(e: any) => setSearch(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-[1fr_40%] gap-4 basis-1/2">
              <Select
                placeholder="View Payment Status"
                className="p-4 text-base"
              >
                <Select.Option value="1">1</Select.Option>
                <Select.Option value="2">2</Select.Option>
              </Select>
              <Button className="p-3 max-w-xs" appearance="primary">
                Create Invoice
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-auto">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={fakeData}
            showHeader={true}
            tableLayout="fixed"
            pagination={{
              pageSize: 5,
              hideOnSinglePage: true,
              showSizeChanger: false,
            }}
            components={{
              table: ({ ...rest }: any) => {
                // let tableFlexGrow = rest?.children[2]?.props?.data?.length / 5;
                let tableFlexGrow = 1;
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
                  return (
                    <Popover
                      placement="bottom"
                      showArrow={false}
                      content={
                        <div className="grid grid-cols-1 gap-2">
                          <Button
                            appearance="link"
                            className="text-casper-500 p-2"
                            // onClick={() =>
                            //   router.push(
                            //     `/admin/patient-list/${rest["data-row-key"]}`
                            //   )
                            // }
                          >
                            <div className="flex items-center gap-2">
                              <BsEyeFill className="text-base" />
                              <div>View</div>
                            </div>
                          </Button>
                          <Button
                            appearance="link"
                            className="text-casper-500 p-2"
                          >
                            <div className="flex items-center gap-2">
                              <BsPencilSquare className="text-base" />
                              <div>Edit</div>
                            </div>
                          </Button>
                          <Button
                            appearance="link"
                            className="text-casper-500 p-2"
                            // onClick={() => deletePatient(rest["data-row-key"])}
                          >
                            <div className="flex items-center gap-2">
                              <BsTrashFill className="text-base" />
                              <div>Delete</div>
                            </div>
                          </Button>
                        </div>
                      }
                      trigger="click"
                    >
                      <tr {...rest} />
                    </Popover>
                  );
                },
              },
            }}
            className="[&.ant-table]:!rounded-none"
          />
        </div>
      </div>
    </Card>
  );
}

export default TreatmentRecords;
