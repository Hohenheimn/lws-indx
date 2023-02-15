import { Popover, Table } from "antd";
import React from "react";
import { Button } from "../../components/Button";
import Card from "../../components/Card";
import Input from "../../components/Input";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { NextPageProps } from "../../../utils/types/NextPageProps";

let fakeData = [
  {
    id: 1,
    prescription_name: "Pre-0005",
    date_created: "01/02/2022",
    total_amount: 1000,
  },
  {
    id: 2,
    prescription_name: "Pre-0004",
    date_created: "01/02/2022",
    total_amount: 1000,
  },
  {
    id: 3,
    prescription_name: "Pre-0003",
    date_created: "01/02/2022",
    total_amount: 1000,
  },
  {
    id: 4,
    prescription_name: "Pre-0002",
    date_created: "01/02/2022",
    total_amount: 1000,
  },
  {
    id: 5,
    prescription_name: "Pre-0001",
    date_created: "01/02/2022",
    total_amount: 1000,
  },
];

const columns: any = [
  {
    title: "Prescription Name",
    dataIndex: "prescription_name",
    width: "10rem",
    align: "center",
  },
  {
    title: "Date Created",
    dataIndex: "date_created",
    width: "10rem",
    align: "center",
  },
];

export function Prescription({ patientRecord }: any) {
  return (
    <Card className="flex-auto p-0">
      <div className="space-y-8 h-full flex flex-col">
        <div className="space-y-4 md:p-12 p-6 !pb-0">
          <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
            <h4 className="basis-full md:basis-auto">Prescription</h4>
          </div>
          <div className="flex justify-between align-middle gap-4">
            <div className="basis-1/2">
              <Input
                placeholder="Search"
                prefix={<AiOutlineSearch className="text-lg text-casper-500" />}
                className="rounded-full text-base shadow-none"
              />
            </div>
            <div>
              <Button className="p-3 max-w-xs" appearance="primary">
                Create Prescription
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
                let tableFlexGrow = rest?.children[2]?.props?.data?.length / 5;
                return (
                  <table
                    {...rest}
                    style={{ flex: `${tableFlexGrow} 1 auto` }}
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

export default Prescription;
