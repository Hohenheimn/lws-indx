import React from "react";
import { PageContainer } from "../../../components/animation";
import { Button } from "../../../components/Button";
import PrivateRoute from "../../../auth/HOC/PrivateRoute";
import VerifyAuth from "../../../auth/HOC/VerifyAuth";
import Table from "antd/lib/table/Table";
import { AiOutlineSearch } from "react-icons/ai";
import Input from "../../../components/Input";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { NextPageProps } from "../../../../utils/types/NextPageProps";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData } from "../../../../utils/api";
import { Form, Popover, notification } from "antd";
import { Context } from "../../../../utils/context/Provider";
import AddBranchModal from "../../../page-components/branch-management/modals/AddBranchModal";
import moment from "moment";

export function BranchManagement({ router }: NextPageProps) {
  const [BranchForm] = Form.useForm();
  const { setIsAppLoading } = React.useContext(Context);
  const queryClient = useQueryClient();

  let [page, setPage] = React.useState(1);
  let [isBranchModalOpen, setIsBranchModalOpen] = React.useState(false);

  const { data: branch, isFetching: isBranchesLoading } = useQuery(
    ["branch", page],
    () =>
      fetchData({
        url: `/api/branch?limit=5&page=${page}`,
      })
  );

  const { mutate: deleteBranch }: any = useMutation(
    (id: number) =>
      deleteData({
        url: `/api/branch/${id}`,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      }),
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Branch Deleted",
          description: "Branch has been deleted",
        });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["branch"] });
        const previousValues = queryClient.getQueryData(["branch"]);
        queryClient.setQueryData(["branch"], (oldData: any) =>
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
        queryClient.setQueryData(["branch"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["branch"] });
      },
    }
  );

  const columns: any = [
    {
      title: "Branch Name",
      dataIndex: "name",
      width: "15rem",
      align: "center",
    },
    {
      title: "Email Address",
      dataIndex: "email",
      width: "10rem",
      align: "center",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobile_no",
      width: "10rem",
      align: "center",
    },
    {
      title: "City",
      dataIndex: "city",
      width: "10rem",
      align: "center",
    },
  ];

  return (
    <>
      <PageContainer>
        <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap mb-4">
          <h3 className="basis-auto whitespace-nowrap">Branch Management</h3>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="basis-full lg:basis-1/2">
            <Input
              placeholder="Search"
              prefix={<AiOutlineSearch className="text-lg text-casper-500" />}
              className="rounded-full border-none text-lg"
            />
          </div>
          <div className="basis-full lg:basis-auto flex gap-4">
            <Button
              className="p-3 min-w-[15rem]"
              appearance="primary"
              onClick={() => setIsBranchModalOpen(true)}
            >
              <div className="flex justify-center items-center">
                <IoIosAdd className="inline-block text-2xl" />{" "}
                <span>Add Clinic Branch</span>
              </div>
            </Button>
          </div>
        </div>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={branch?.data}
          showHeader={true}
          tableLayout="fixed"
          loading={isBranchesLoading}
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
            showSizeChanger: false,
            total: branch?.meta?.total,
            onChange: (page) => setPage(page),
          }}
          components={{
            table: ({ ...rest }: any) => {
              let tableFlexGrow = rest?.children[2]?.props?.data?.length / 5;
              return (
                <table {...rest} style={{ flex: `${tableFlexGrow} 1 auto` }} />
              );
            },
            body: {
              row: ({ ...rest }: any) => {
                let selectedRow = branch?.data?.find(
                  ({ _id }: any) => _id === rest["data-row-key"]
                );

                let schedules = selectedRow?.schedules?.map(
                  ({ day, open_time, close_time }: any) => ({
                    day: day,
                    opening_time: moment(open_time, "HH:mm:ss"),
                    closing_time: moment(close_time, "HH:mm:ss"),
                  })
                );

                return (
                  <Popover
                    placement="bottom"
                    showArrow={false}
                    content={
                      <div className="grid grid-cols-1 gap-2">
                        <Button
                          appearance="link"
                          className="text-casper-500 p-2"
                          onClick={() => {
                            BranchForm.setFieldsValue({
                              ...selectedRow,
                              _id: selectedRow._id,
                              schedules,
                            });

                            setIsBranchModalOpen(true);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <BsPencilSquare className="text-base" />
                            <div>Edit</div>
                          </div>
                        </Button>
                        <Button
                          appearance="link"
                          className="text-casper-500 p-2"
                          onClick={() => deleteBranch(rest["data-row-key"])}
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
        />
      </PageContainer>
      <AddBranchModal
        show={isBranchModalOpen}
        onClose={() => {
          setIsBranchModalOpen(false);
          BranchForm.resetFields();
        }}
        className="w-[80rem]"
        id="branch-modal"
        form={BranchForm}
      />
    </>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(BranchManagement);
