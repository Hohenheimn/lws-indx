import React from "react";
import { PageContainer } from "../../../components/animation";
import Input from "../../../components/Input";
import { Button } from "../../../components/Button";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { AiOutlineSearch } from "react-icons/ai";
import { Radio } from "../../../components/Radio";
import Table from "antd/lib/table";
import Image from "next/image";
import PrivateRoute from "../../../auth/HOC/PrivateRoute";
import VerifyAuth from "../../../auth/HOC/VerifyAuth";
import { NextPageProps } from "../../../../utils/types/NextPageProps";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData } from "../../../../utils/api";
import { Popover, notification } from "antd";
import { Context } from "../../../../utils/context/Provider";

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
    dataIndex: "_id",
    width: "15rem",
    align: "center",
    render: (id: number) => <div className="whitespace-nowrap">{id}</div>,
  },
  {
    title: "Email Address",
    dataIndex: "email",
    width: "15rem",
    align: "center",
  },
  {
    title: "Mobile Number",
    dataIndex: "mobile_no",
    width: "10rem",
    align: "center",
  },
];

export function PatientList({ router }: NextPageProps) {
  let [page, setPage] = React.useState(1);
  const { setIsAppLoading } = React.useContext(Context);
  const queryClient = useQueryClient();
  const { data: patients, isFetching: isPatientsLoading } = useQuery(
    ["patient", page],
    () =>
      fetchData({
        url: `/api/patient?limit=5&page=${page}`,
      })
  );

  const { mutate: deletePatient }: any = useMutation(
    (id: number) =>
      deleteData({
        url: `/api/patient/${id}`,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      }),
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Patient Deleted",
          description: "Patient has been deleted",
        });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["patient"] });
        const previousValues = queryClient.getQueryData(["patient"]);
        queryClient.setQueryData(["patient"], (oldData: any) =>
          oldData ? [...oldData, newData] : undefined
        );

        return { previousValues };
      },
      onError: (err: any, _, context: any) => {
        notification.warning({
          message: "Something Went Wrong",
          description: `${
            err.response.data[Object.keys(err.response.data)[0]]
          }`,
        });
        queryClient.setQueryData(["patient"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["patient"] });
      },
    }
  );

  return (
    <>
      <PageContainer>
        <h3>Patient List</h3>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="basis-full lg:basis-1/2">
            <Input
              placeholder="Search"
              prefix={<AiOutlineSearch className="text-lg text-casper-500" />}
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
            rowKey="_id"
            columns={columns}
            dataSource={patients?.data}
            showHeader={true}
            className="md:mt-6"
            tableLayout="fixed"
            loading={isPatientsLoading}
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
                            onClick={() =>
                              router.push(
                                `/admin/patient-list/${rest["data-row-key"]}`
                              )
                            }
                          >
                            <div className="flex items-center gap-2">
                              <BsEyeFill className="text-base" />
                              <div>View</div>
                            </div>
                          </Button>
                          <Button
                            appearance="link"
                            className="text-casper-500 p-2"
                            onClick={() =>
                              router.push(
                                `/admin/patient-list/${rest["data-row-key"]}?tab=2`
                              )
                            }
                          >
                            <div className="flex items-center gap-2">
                              <BsPencilSquare className="text-base" />
                              <div>Edit</div>
                            </div>
                          </Button>
                          <Button
                            appearance="link"
                            className="text-casper-500 p-2"
                            onClick={() => deletePatient(rest["data-row-key"])}
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
            pagination={{
              pageSize: 5,
              hideOnSinglePage: true,
              showSizeChanger: false,
              total: patients?.meta?.total,
              onChange: (page) => setPage(page),
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
