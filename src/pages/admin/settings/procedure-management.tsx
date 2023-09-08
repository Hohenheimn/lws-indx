import React from "react";
import { Form, Popover, notification } from "antd";
import Table from "antd/lib/table/Table";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import PrivateRoute from "@auth/HOC/PrivateRoute";
import VerifyAuth from "@auth/HOC/VerifyAuth";
import { PageContainer } from "@components/animation";
import { Button } from "@components/Button";
import Input from "@components/Input";
import AddProcedureModal from "@pagecomponents/procedure-management/modals/AddProcedureModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import { numberSeparator } from "@utilities/helpers";
import { NextPageProps } from "@utilities/types/NextPageProps";

export function ProcedureManagement({ router, profile }: any) {
  const [ProcedureForm] = Form.useForm();
  const { setIsAppLoading } = React.useContext(Context);
  const queryClient = useQueryClient();

  let [search, setSearch] = React.useState("");
  let [page, setPage] = React.useState(1);
  let [isProcedureModalOpen, setIsProcedureModalOpen] = React.useState(false);

  const { data: procedure, isFetching: isProceduresLoading } = useQuery(
    ["procedure", page, search],
    () =>
      fetchData({
        url: `/api/procedure?limit=10&page=${page}&search=${search}`,
      })
  );

  const { mutate: deleteProcedure }: any = useMutation(
    (id: number) =>
      deleteData({
        url: `/api/procedure/${id}`,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      }),
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Procedure Deleted",
          description: "Procedure has been deleted",
        });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["procedure"] });
        const previousValues = queryClient.getQueryData(["procedure"]);
        queryClient.setQueryData(["procedure"], (oldData: any) =>
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
        queryClient.setQueryData(["procedure"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["procedure"] });
      },
    }
  );

  const columns: any = [
    {
      title: "Procedure",
      dataIndex: "procedure_name",
      width: "15rem",
      align: "center",
    },
    {
      title: "Abbreviation",
      dataIndex: "abbreviation",
      width: "10rem",
      align: "center",
    },
    {
      title: "Category",
      dataIndex: "category",
      width: "10rem",
      align: "center",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      width: "10rem",
      align: "center",
      render: (cost: number) =>
        `${profile.setting.currency} ${numberSeparator(cost)}`,
    },
    {
      title: "Color",
      dataIndex: "color_code",
      width: "10rem",
      align: "center",
      render: (color_code: string) => (
        <div className="w-full flex justify-center">
          <div
            style={{ backgroundColor: `${color_code}` }}
            className={`h-4 w-4 rounded-full`}
          ></div>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageContainer>
        <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap mb-4">
          <h3 className="basis-auto whitespace-nowrap">Procedure Management</h3>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div className="basis-full lg:basis-1/2">
            <Input
              placeholder="Search"
              prefix={<AiOutlineSearch className="text-lg text-casper-500" />}
              className="rounded-full text-base shadow-none"
              onChange={(e: any) => setSearch(e.target.value)}
            />
          </div>
          <div className="basis-full lg:basis-auto flex gap-4">
            <Button
              className="p-3 min-w-[15rem]"
              appearance="primary"
              onClick={() => setIsProcedureModalOpen(true)}
            >
              <div className="flex justify-center items-center">
                <IoIosAdd className="inline-block text-2xl" />{" "}
                <span>Add Procedure</span>
              </div>
            </Button>
          </div>
        </div>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={procedure?.data}
          showHeader={true}
          tableLayout="fixed"
          loading={isProceduresLoading}
          pagination={{
            pageSize: 10,
            hideOnSinglePage: true,
            showSizeChanger: false,
            total: procedure?.meta?.total,
            onChange: (page) => setPage(page),
          }}
          components={{
            table: ({ ...rest }: any) => {
              let tableFlexGrow = rest?.children[2]?.props?.data?.length / 10;
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
                let selectedRow = procedure?.data?.find(
                  ({ _id }: any) => _id === rest["data-row-key"]
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
                            ProcedureForm.setFieldsValue({
                              ...selectedRow,
                              _id: selectedRow._id,
                            });

                            setIsProcedureModalOpen(true);
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
                          onClick={() => deleteProcedure(rest["data-row-key"])}
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
      <AddProcedureModal
        show={isProcedureModalOpen}
        onClose={() => {
          setIsProcedureModalOpen(false);
          ProcedureForm.resetFields();
        }}
        className="w-[40rem]"
        id="procedure-modal"
        form={ProcedureForm}
        currency={profile.setting.currency}
      />
    </>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(ProcedureManagement);
