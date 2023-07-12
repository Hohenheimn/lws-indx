import React from "react";
import { Form, Popover, notification } from "antd";
import Table from "antd/lib/table/Table";
import { differenceInYears } from "date-fns";
import moment from "moment";
import { AiOutlineSearch } from "react-icons/ai";
import { BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import PrivateRoute from "@auth/HOC/PrivateRoute";
import VerifyAuth from "@auth/HOC/VerifyAuth";
import { PageContainer } from "@components/animation";
import { Button } from "@components/Button";
import Input from "@components/Input";
import AddClinicAccountModal from "@pagecomponents/clinic-accounts/modals/AddClinicAccountModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import { NextPageProps } from "@utilities/types/NextPageProps";


export function ProcedureManagement({ router }: NextPageProps) {
  const [AccountForm] = Form.useForm();
  const { setIsAppLoading } = React.useContext(Context);
  const queryClient = useQueryClient();

  let [search, setSearch] = React.useState("");
  let [page, setPage] = React.useState(1);
  let [isAccountModalOpen, setIsAccountModalOpen] = React.useState(false);

  const { data: account, isFetching: isAccountLoading } = useQuery(
    ["account", page, search],
    () =>
      fetchData({
        url: `/api/account?limit=5&page=${page}&search=${search}`,
      })
  );

  const { mutate: deleteClinicAccounts }: any = useMutation(
    (id: number) =>
      deleteData({
        url: `/api/account/${id}`,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      }),
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Clinic Account Deleted",
          description: "Clinic account has been deleted",
        });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["account"] });
        const previousValues = queryClient.getQueryData(["account"]);
        queryClient.setQueryData(["account"], (oldData: any) =>
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
        queryClient.setQueryData(["account"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["account"] });
      },
    }
  );

  const columns: any = [
    {
      title: "Full Name",
      dataIndex: "name",
      width: "15rem",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "15rem",
      align: "center",
    },
    {
      title: "Account Type",
      dataIndex: "account_role",
      width: "10rem",
      align: "center",
    },
  ];

  return (
    <>
      <PageContainer>
        <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap mb-4">
          <h3 className="basis-auto whitespace-nowrap">Clinic Accounts</h3>
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
              onClick={() => setIsAccountModalOpen(true)}
            >
              <div className="flex justify-center items-center">
                <IoIosAdd className="inline-block text-2xl" />{" "}
                <span>Add Clinic Account</span>
              </div>
            </Button>
          </div>
        </div>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={account?.data}
          showHeader={true}
          tableLayout="fixed"
          loading={isAccountLoading}
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
            showSizeChanger: false,
            total: account?.meta?.total,
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
                let selectedRow = account?.data?.find(
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
                            AccountForm.setFieldsValue({
                              ...selectedRow,
                              birthdate: moment(selectedRow.birthdate).isValid()
                                ? moment(selectedRow.birthdate)
                                : undefined,
                              age: moment(selectedRow.birthdate).isValid()
                                ? differenceInYears(
                                    new Date(),
                                    new Date(selectedRow.birthdate)
                                  ).toString()
                                : undefined,
                              _id: selectedRow._id,
                            });

                            setIsAccountModalOpen(true);
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
                          onClick={() =>
                            deleteClinicAccounts(rest["data-row-key"])
                          }
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
      <AddClinicAccountModal
        show={isAccountModalOpen}
        onClose={() => {
          setIsAccountModalOpen(false);
          AccountForm.resetFields();
        }}
        className="w-[80rem]"
        id="account-modal"
        form={AccountForm}
      />
    </>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(ProcedureManagement);
