import React from "react";
import { PageContainer } from "../../components/animation";
import Input from "../../components/Input";
import { Button } from "../../components/Button";
import "chart.js/auto";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import { Radio } from "../../components/Radio";
import Table from "antd/lib/table";
import Image from "next/image";
import PrivateRoute from "../../auth/HOC/PrivateRoute";
import VerifyAuth from "../../auth/HOC/VerifyAuth";
import { NextPageProps } from "../../../utils/types/NextPageProps";

let fakeData = [
  {
    id: 0,
    first_name: "Kaley",
    last_name: "Cuoco",
    email_address: "caley@gmail.com",
    mobile_number: "0995-732-1015",
  },
  {
    id: 1,
    first_name: "Kaley1",
    last_name: "Cuoco1",
    email_address: "caley1@gmail.com",
    mobile_number: "0995-732-1016",
  },
  {
    id: 2,
    first_name: "Kaley2",
    last_name: "Cuoco2",
    email_address: "caley2@gmail.com",
    mobile_number: "0995-732-1017",
  },
  {
    id: 3,
    first_name: "Kaley3",
    last_name: "Cuoco3",
    email_address: "caley@gmail.com",
    mobile_number: "0995-732-1018",
  },
  {
    id: 4,
    first_name: "Kaley4",
    last_name: "Cuoco4",
    email_address: "caley@gmail.com",
    mobile_number: "0995-732-1019",
  },
];

const columns: any = [
  {
    title: "",
    width: "5rem",
    align: "center",
    render: () => {
      return (
        <div className="relative w-10 h-10 m-auto">
          <Image
            src="https://picsum.photos/500/500"
            alt="random pics"
            fill
            sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
            className="object-center rounded-full"
          />
        </div>
      );
    },
  },
  {
    title: "First Name",
    dataIndex: "first_name",
    width: "10rem",
    align: "center",
  },
  {
    title: "Last Name",
    dataIndex: "last_name",
    width: "10rem",
    align: "center",
  },
  {
    title: "Patient Number",
    dataIndex: "id",
    width: "10rem",
    align: "center",
  },
  {
    title: "Email Address",
    dataIndex: "email_address",
    width: "15rem",
    align: "center",
  },
  {
    title: "Mobile Number",
    dataIndex: "mobile_number",
    width: "10rem",
    align: "center",
  },
  // {
  //   width: "0",
  //   align: "center",
  //   render: () => {
  //     return (
  //       <div className="grid grid-cols-3 gap-4 items-center justify-center place-items-center">
  //         <Button appearance="link" className="text-base">
  //           <BsEyeFill />
  //         </Button>
  //         <Button appearance="link" className="text-base">
  //           <BsPencilSquare />
  //         </Button>
  //         <Button appearance="link" className="text-base">
  //           <BsTrashFill />
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];

export function PatientList({ router }: NextPageProps) {
  return (
    <>
      <PageContainer>
        <h3>Patient List</h3>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="basis-full lg:basis-1/2">
            <Input
              placeholder="Search"
              prefix={<AiOutlineSearch className="text-lg text-gray-300" />}
              className="rounded-full border-none text-lg"
            />
          </div>
          <div className="basis-full lg:basis-auto flex gap-4">
            <Radio.Group defaultValue="my_patients">
              <Radio.Button value="my_patients" label="My Patients" />
              <Radio.Button value="shared_patients" label="Shared Patients" />
            </Radio.Group>
          </div>
        </div>
        <div className="flex flex-col flex-auto">
          <Table
            id="tab"
            rowKey="id"
            columns={columns}
            dataSource={fakeData}
            showHeader={true}
            className="md:mt-6"
            tableLayout="fixed"
            onRow={({ id }) => {
              return {
                onClick: () => {
                  router.push(`/patient-list/${id}`);
                },
              };
            }}
            pagination={{
              pageSize: 5,
              hideOnSinglePage: true,
              showSizeChanger: false,
            }}
          />
        </div>
      </PageContainer>
    </>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(PatientList);
