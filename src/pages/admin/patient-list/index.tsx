import React, { useState } from "react";
import { Checkbox, Form, Popover, notification } from "antd";
import Table from "antd/lib/table";
import Image from "next/image";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";
import { scroller } from "react-scroll";
import PrivateRoute from "@auth/HOC/PrivateRoute";
import VerifyAuth from "@auth/HOC/VerifyAuth";
import { PageContainer } from "@components/animation";
import Avatar from "@components/Avatar";
import { Button } from "@components/Button";
import Input from "@components/Input";
import { Radio } from "@components/Radio";
import { InfiniteSelect } from "@src/components/InfiniteSelect";
import Modal from "@src/components/Modal";
import { Select } from "@src/components/Select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData, postDataNoFormData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import { NextPageProps } from "@utilities/types/NextPageProps";

export function PatientList({ profile, router }: any) {
  let [search, setSearch] = React.useState("");
  let [page, setPage] = React.useState(1);
  const { setIsAppLoading } = React.useContext(Context);
  const queryClient = useQueryClient();
  const { data: patients, isFetching: isPatientsLoading } = useQuery(
    ["patient", page, search],
    () =>
      fetchData({
        url: `/api/patient?limit=5&page=${page}&search=${search}`,
      })
  );
  const [patientsID, setPatientsID] = useState<string[]>([]);

  const { mutate: sendMessage } = useMutation(
    (payload: any) => {
      return postDataNoFormData({
        url: `/api/patient/notification`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Message sent successfully",
          description: `Message sent successfully`,
        });
        sendMessageForm.resetFields();
        setPatientsID([]);
        setShow(false);
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: ["sms-template"],
        });
        const previousValues = queryClient.getQueryData(["sms-template"]);
        queryClient.setQueryData(["sms-template"], (oldData: any) =>
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
        queryClient.setQueryData(["sms-template"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["sms-template"] });
      },
    }
  );

  const columns: any = [
    {
      title: "",
      width: "5rem",
      align: "center",
      render: ({ _, _id }: any) => {
        return (
          <Checkbox
            checked={patientsID.includes(_id)}
            onChange={(e) => {
              // Handle checkbox change event here
              if (!patientsID.includes(_id)) {
                setPatientsID([...patientsID, _id]);
              }
              if (patientsID.includes(_id)) {
                const fitler = patientsID.filter((filter) => filter !== _id);
                setPatientsID(fitler);
              }
            }}
          />
        );
      },
    },
    {
      title: "",
      width: "5rem",
      align: "center",
      render: ({ profile_picture, _id }: any) => {
        return (
          <Avatar
            className="h-14 w-14 p-2 overflow-hidden relative border border-gray-300 avatar transition"
            onClick={() =>
              router.push(`/admin/patient-list/${_id}?tab=Personal Info`)
            }
          >
            {!profile_picture ? (
              <IoPersonOutline className="h-full w-full text-white" />
            ) : (
              <Image
                src={profile_picture}
                alt="Patient's Picture"
                fill
                sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                className="object-center h-full w-full"
                objectFit="cover"
              />
            )}
          </Avatar>
        );
      },
    },
    {
      title: "First Name",
      width: "15rem",
      align: "center",
      render: ({ first_name, _id }: any) => {
        return (
          <div
            onClick={() =>
              router.push(`/admin/patient-list/${_id}?tab=Personal Info`)
            }
          >
            {first_name}
          </div>
        );
      },
    },
    {
      title: "Last Name",
      width: "15rem",
      align: "center",
      render: ({ last_name, _id }: any) => {
        return (
          <div
            onClick={() =>
              router.push(`/admin/patient-list/${_id}?tab=Personal Info`)
            }
          >
            {last_name}
          </div>
        );
      },
    },
    {
      title: "Patient Number",
      width: "15rem",
      align: "center",
      render: ({ patient_no, _id }: any) => {
        return (
          <div
            className="whitespace-nowrap"
            onClick={() =>
              router.push(`/admin/patient-list/${_id}?tab=Personal Info`)
            }
          >
            {patient_no}
          </div>
        );
      },
    },
    {
      title: "Email Address",
      width: "15rem",
      align: "center",
      render: ({ email, _id }: any) => {
        return (
          <div
            onClick={() =>
              router.push(`/admin/patient-list/${_id}?tab=Personal Info`)
            }
          >
            {email}
          </div>
        );
      },
    },
    {
      title: "Mobile Number",
      width: "15rem",
      align: "center",
      render: ({ mobile_no, _id }: any) => {
        return (
          <div
            onClick={() =>
              router.push(`/admin/patient-list/${_id}?tab=Personal Info`)
            }
          >
            {mobile_no}
          </div>
        );
      },
    },
  ];

  const [show, setShow] = useState(false);

  const [sendMessageForm] = Form.useForm();

  return (
    <>
      <Modal
        show={show}
        onClose={() => {
          setShow(false);
        }}
        className=" w-[40rem]"
      >
        <Form
          form={sendMessageForm}
          layout="vertical"
          onFinish={(values: any) => {
            values.patient_ids = patientsID;
            sendMessage(values);
          }}
          onFinishFailed={(data) => {
            scroller.scrollTo(
              data?.errorFields[0]?.name?.join("-")?.toString(),
              {
                smooth: true,
                offset: -50,
              }
            );
          }}
          className="space-y-5 grid-cols-12"
        >
          <Form.Item
            label="Select where to send"
            name="where_to_send"
            rules={[
              {
                required: true,
                message: "This is required",
              },
            ]}
            required={false}
            className="col-span-12 lg:col-span-6"
          >
            <Select placeholder="Select where to send" id="where_to_send">
              <Select.Option value={"Email"}>Email</Select.Option>

              <Select.Option value={"SMS"}>SMS</Select.Option>
              <Select.Option value={"Both"}>Both</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Select Template"
            name="template_id"
            rules={[
              {
                required: true,
                message: "This is required",
              },
            ]}
            required={false}
            className="col-span-12 lg:col-span-6"
          >
            <InfiniteSelect
              placeholder="Select Clinic"
              id="template_id"
              api={`${process.env.REACT_APP_API_BASE_URL}/api/sms-manager?limit=3&for_dropdown=true&page=1`}
              queryKey={["sms-template"]}
              displayValueKey="name"
              returnValueKey="_id"
            />
          </Form.Item>
          <div className="flex justify-end items-center gap-4">
            <Button
              appearance="link"
              className="p-4 bg-transparent border-none text-casper-500 font-semibold"
              onClick={() => {
                setShow(false);
              }}
            >
              Cancel
            </Button>
            <Button
              appearance="primary"
              className="max-w-[10rem]"
              type="submit"
            >
              Save
            </Button>
          </div>
        </Form>
      </Modal>
      <PageContainer>
        <div className="flex items-start xs:items-center justify-between flex-col xs:flex-row">
          <h3>Patient List</h3>
          <div>
            <Button
              appearance="primary"
              onClick={() => {
                if (patientsID.length <= 0) {
                  notification.warning({
                    message: "No Patients Selected",
                    description: `Select a patient to send a message`,
                  });
                  return;
                }
                setShow(true);
              }}
            >
              Send SMS / Email
            </Button>
          </div>
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
          {/* <div className="basis-full lg:basis-auto flex gap-4">
            <Radio.Group defaultValue="my_patients">
              <Radio.Button value="my_patients" label="My Patients" />
              <Radio.Button value="shared_patients" label="Shared Patients" />
            </Radio.Group>
          </div> */}
        </div>
        <div className="flex flex-col flex-auto">
          <Table
            id="tab"
            rowKey="_id"
            columns={columns}
            dataSource={patients?.data}
            showHeader={true}
            tableLayout="fixed"
            loading={isPatientsLoading}
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
                  return <tr {...rest} />;
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
