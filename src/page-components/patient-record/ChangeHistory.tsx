import React from "react";
import { Table } from "antd";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { Button } from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";

let fakeData = [
  {
    id: 1,
    changes_made: "Update Personal Info - First Name",
    date_created: "01/02/2022",
    username: "Dr. Mark Abrem",
  },
  {
    id: 2,
    changes_made: "Update Personal Info - Last Name",
    date_created: "01/02/2022",
    username: "Dr. Mark Abrem",
  },
  {
    id: 3,
    changes_made: "Create Prescription - Pre-003",
    date_created: "01/02/2022",
    username: "Dr. Mark Abrem",
  },
  {
    id: 4,
    changes_made: "Deleted Treatment Plan - Treatment Plan A",
    date_created: "01/02/2022",
    username: "Dr. Mark Abrem",
  },
  {
    id: 5,
    changes_made: "Create Gallery - Gallery 1",
    date_created: "01/02/2022",
    username: "Dr. Mark Abrem",
  },
];

const columns: any = [
  {
    title: "Changes Made",
    dataIndex: "changes_made",
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
    title: "Username",
    dataIndex: "username",
    width: "10rem",
    align: "center",
  },
];

export function ChangeHistory({ patientRecord }: any) {
  let [search, setSearch] = React.useState("");
  return (
    <Card className="flex-auto p-0">
      <div className="space-y-8 h-full flex flex-col">
        <div className="space-y-4 md:p-12 p-6 !pb-0">
          <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
            <h4 className="basis-full md:basis-auto">Change History</h4>
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
            className="[&.ant-table]:!rounded-none"
          />
        </div>
      </div>
    </Card>
  );
}

export default ChangeHistory;
