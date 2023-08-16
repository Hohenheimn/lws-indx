import React from "react";
import { Form, notification } from "antd";
import { scroller } from "react-scroll";
import Modal from "@components/Modal";
import { Button } from "@src/components/Button";
import { Select } from "@src/components/Select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  postDataMultipleFile,
  postDataNoFormData,
  updateData,
  updateDataNoFormData,
} from "@utilities/api";
import { Context } from "@utilities/context/Provider";

export default function SMSSettings({
  show,
  onClose,
  form,
  patientRecord,
  ...rest
}: any) {
  const queryClient = useQueryClient();

  const { setIsAppLoading } = React.useContext(Context);

  let id = form?.getFieldValue("_id");

  const { mutate: createSMSSettings } = useMutation(
    (payload: FormData) => {
      return postDataNoFormData({
        url: `/api/sms-setting`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Creating SMS Settings Success",
          description: `Creating SMS Settings Success`,
        });
        form.resetFields();
        onClose();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: ["sms-settings"],
        });
        const previousValues = queryClient.getQueryData(["sms-settings"]);
        queryClient.setQueryData(["sms-settings"], (oldData: any) =>
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
        queryClient.setQueryData(["sms-settings"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({
          queryKey: ["sms-settings"],
        });
      },
    }
  );

  const { mutate: editSMSSettings } = useMutation(
    (payload: any) => {
      return updateDataNoFormData({
        url: `/api/sms-setting/${id}`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "SMS Settings Updated!",
          description: `SMS Settings Updated!`,
        });
        form.resetFields();
        onClose();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: ["sms-settings"],
        });
        const previousValues = queryClient.getQueryData(["sms-settings"]);
        queryClient.setQueryData(["sms-settings"], (oldData: any) =>
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
        queryClient.setQueryData(["sms-settings"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["sms-settings"] });
      },
    }
  );

  return (
    <Modal show={show} onClose={onClose} {...rest}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="font-bold text-3xl">SMS Settings</div>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            if (!id) {
              createSMSSettings(values);
            } else {
              editSMSSettings(values);
            }
          }}
          onFinishFailed={(data) => {
            scroller.scrollTo(
              data?.errorFields[0]?.name?.join("-")?.toString(),
              {
                smooth: true,
                offset: -50,
                containerId: rest?.id,
              }
            );
          }}
          className="space-y-12"
        >
          <ul className=" space-y-5">
            <li className=" space-x-3 flex justify-between">
              <div>
                <p className=" lg:text-2xl font-semibold mb-2">
                  SMS Appointment Reminder
                </p>
                <p>
                  Send SMS reminder to patients who scheduled an appointment.
                </p>
              </div>
              <div>
                <Form.Item
                  name="sms_appointment_reminder"
                  rules={[
                    {
                      required: true,
                      message: "Treatment Plan Name is required",
                    },
                  ]}
                  required={false}
                >
                  <Select id="sms_appointment_reminder">
                    <Select.Option value={"Enable"}>Enable</Select.Option>
                    <Select.Option value={"Disable"}>Disable</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </li>
            <li className=" space-x-3 flex justify-between">
              <div>
                <p className=" lg:text-2xl font-semibold mb-2">
                  SMS Birthday Reminder
                </p>
                <p>Send SMS reminder to patients whose birthday is upcoming.</p>
              </div>
              <div>
                <Form.Item
                  name="sms_birthday_reminder"
                  rules={[
                    {
                      required: true,
                      message: "Treatment Plan Name is required",
                    },
                  ]}
                  required={false}
                >
                  <Select id="sms_birthday_reminder">
                    <Select.Option value={"Enable"}>Enable</Select.Option>
                    <Select.Option value={"Disable"}>Disable</Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </li>
            <li className=" space-x-3 flex justify-between">
              <div>
                <p className=" lg:text-2xl font-semibold mb-2">
                  SMS Reminder Frequency
                </p>
                <p>How many day/s before sending the appointment reminder.</p>
              </div>
              <div>
                <Form.Item
                  name="sms_reminder_frequency"
                  rules={[
                    {
                      required: true,
                      message: "Treatment Plan Name is required",
                    },
                  ]}
                  required={false}
                >
                  <Select id="sms_reminder_frequency">
                    <Select.Option value={"1 Day Before"}>
                      1 Day Before
                    </Select.Option>
                    <Select.Option value={"2 Days Before"}>
                      2 Days Before
                    </Select.Option>
                    <Select.Option value={"3 Days Before"}>
                      3 Days Before
                    </Select.Option>
                    <Select.Option value={"4 Days Before"}>
                      4 Days Before
                    </Select.Option>
                    <Select.Option value={"5 Days Before"}>
                      5 Days Before
                    </Select.Option>
                    <Select.Option value={"6 Days Before"}>
                      6 Days Before
                    </Select.Option>
                    <Select.Option value={"7 Days Before"}>
                      7 Days Before
                    </Select.Option>
                    <Select.Option value={"1 Month Before"}>
                      1 Month Before
                    </Select.Option>
                  </Select>
                </Form.Item>
              </div>
            </li>
          </ul>
          <div className="flex justify-end items-center gap-4">
            <Button
              appearance="link"
              className="p-4 bg-transparent border-none text-casper-500 font-semibold"
              onClick={() => onClose()}
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
      </div>
    </Modal>
  );
}
