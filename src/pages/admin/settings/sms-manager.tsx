import React, { useEffect, useState } from "react";
import { Form, Popover } from "antd";
import DatePicker from "antd/lib/date-picker";
// import Radio from "antd/lib/radio";
import Table from "antd/lib/table/Table";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { format } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/router";
import { Bar, Doughnut, Pie, Line } from "react-chartjs-2";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { IoIosAdd } from "react-icons/io";
import { twMerge } from "tailwind-merge";
import PrivateRoute from "@auth/HOC/PrivateRoute";
import VerifyAuth from "@auth/HOC/VerifyAuth";
import { PageContainer } from "@components/animation";
import { Button } from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";
import { Radio } from "@components/Radio";
import { Select } from "@components/Select";
import AddSMSTemplate from "@src/page-components/SMSManager/AddSMSTTemplate";
import BuySMSCreditModal from "@src/page-components/SMSManager/BuySMSCreditModal";
import SMSSettings from "@src/page-components/SMSManager/SMSSetting";
import colors from "@styles/theme";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@utilities/api";
import { numberSeparator, paymentStatusPalette } from "@utilities/helpers";
import { NextPageProps } from "@utilities/types/NextPageProps";

let fakeData = [
  {
    _id: 1,
    name: "Birthday Template",
    content: "Happy Birthday",
  },
  {
    _id: 2,
    name: "Follow-Up Template",
    content: "Hi! May we follow-up your payment?",
  },
  {
    _id: 3,
    name: "Schedule Template",
    content: "Hi! Your schedule is on",
  },
];

export function SMSManager({ router }: NextPageProps) {
  const routerCS = useRouter();

  const [showAddSMSTemplateModal, setShowAddSMSTemplateModal] = useState(false);

  const [showSMSSettingModal, setShowSMSSettingModal] = useState(false);

  const [showBuySMSModal, setShowBuySMSModal] = useState(false);

  const [SMSTemplateForm] = Form.useForm();

  const [SMSSettingsForm] = Form.useForm();

  let [search, setSearch] = React.useState("");

  useEffect(() => {
    if (router?.query?.but_SMS_credit) {
      setShowBuySMSModal(true);
    }
  }, [router.query]);

  const columns: any = [
    {
      title: "SMS Template Name",
      dataIndex: "template_name",
      width: "20rem",
      align: "center",
    },
    {
      title: "Message Content",
      dataIndex: "message_content",
      width: "20rem",
      align: "center",
    },
  ];

  let [page, setPage] = React.useState(1);

  let { data: smsTemplate, isLoading: smsTemplateIsLoading } = useQuery(
    ["sms-template", page, search],
    () =>
      fetchData({
        url: `/api/sms-manager?limit=5&page=${page}&search=${search}`,
      })
  );

  let { data: smsSettings } = useQuery(["sms-settings"], () =>
    fetchData({
      url: `/api/sms-setting`,
    })
  );

  return (
    <>
      <PageContainer>
        <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
          <h3 className="basis-full xl:basis-auto whitespace-nowrap">
            SMS Manager
          </h3>
          <div className="flex items-center justify-center xl:basis-auto basis-full">
            <div className="flex gap-x-4 items-center flex-wrap lg:flex-nowrap flex-auto">
              <div className="whitespace-nowrap font-semibold text-sm">
                Your available SMS credits is: 500
              </div>{" "}
              <Button
                appearance="primary"
                className="p-3"
                onClick={() => setShowBuySMSModal(true)}
              >
                Buy SMS Credit
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap mb-4">
          <div className="basis-full lg:basis-1/2">
            <Input
              placeholder="Search"
              prefix={<AiOutlineSearch className="text-lg text-casper-500" />}
              className="rounded-full text-base shadow-none"
              onChange={(e: any) => setSearch(e.target.value)}
            />
          </div>
          <div className="basis-full lg:basis-auto flex gap-4 flex-auto">
            <Button
              className="p-3"
              appearance="primary"
              onClick={() => {
                setShowSMSSettingModal(true);
                SMSSettingsForm.setFieldsValue({
                  _id: smsSettings[0]?._id,
                  sms_appointment_reminder:
                    smsSettings[0]?.sms_appointment_reminder,
                  sms_birthday_reminder: smsSettings[0]?.sms_birthday_reminder,
                  sms_reminder_frequency:
                    smsSettings[0]?.sms_reminder_frequency,
                });
              }}
            >
              SMS Settings
            </Button>
            <Button
              className="p-3"
              appearance="primary"
              onClick={() => setShowAddSMSTemplateModal(true)}
            >
              <div className="flex justify-center items-center">
                <IoIosAdd className="inline-block text-2xl" />{" "}
                <span>Add SMS Template</span>
              </div>
            </Button>
          </div>
        </div>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={smsTemplate?.data}
          showHeader={true}
          tableLayout="fixed"
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
            showSizeChanger: false,
            onChange: (page) => setPage(page),
          }}
          loading={smsTemplateIsLoading}
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
                let selectedRow = smsTemplate?.data.find(
                  ({ _id }: any) => _id === rest["data-row-key"]
                );
                return (
                  <tr
                    {...rest}
                    onClick={() => {
                      SMSTemplateForm.setFieldsValue({
                        ...selectedRow,
                        _id: selectedRow?._id,
                      });
                      setShowAddSMSTemplateModal(true);
                    }}
                  />
                );
              },
            },
          }}
        />
      </PageContainer>

      <AddSMSTemplate
        show={showAddSMSTemplateModal}
        onClose={() => {
          setShowAddSMSTemplateModal(false);
          SMSTemplateForm.resetFields();
        }}
        className="w-[50rem]"
        id="add-sms-template"
        form={SMSTemplateForm}
      />

      <SMSSettings
        form={SMSSettingsForm}
        show={showSMSSettingModal}
        onClose={() => {
          setShowSMSSettingModal(false);
        }}
        className="w-[60rem]"
        id="sms-settings"
      />

      <BuySMSCreditModal
        show={showBuySMSModal}
        onClose={() => {
          setShowBuySMSModal(false);
          routerCS.push("");
        }}
        className="w-[50rem]"
        id="sms-settings"
      />
    </>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(SMSManager);
