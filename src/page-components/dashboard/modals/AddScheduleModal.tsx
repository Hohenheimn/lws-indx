import React from "react";
import Form from "antd/lib/form";
import Input from "../../../components/Input";
import { Button } from "../../../components/Button";
import "chart.js/auto";
import { Select } from "../../../components/Select";
import Modal from "../../../components/Modal";
import { PatternFormat } from "react-number-format";
import { scroller } from "react-scroll";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "../../../../utils/api";
import { DatePicker, TimePicker, notification } from "antd";
import { Context } from "../../../../utils/context/Provider";
import { InfiniteSelect } from "../../../components/InfiniteSelect";
import scheduleType from "../../../../utils/global-data/scheduleType";
import { AutoComplete } from "../../../components/AutoComplete";
import { InfiniteAutoComplete } from "../../../components/InfiniteAutoComplete";
import leaveReasons from "../../../../utils/global-data/leaveReasons";

export default function AddScheduleModal({
  show,
  onClose,
  form,
  setIsPatientModalOpen,
  ...rest
}: any) {
  let [schedType, setSchedType] = React.useState("");

  const queryClient = useQueryClient();
  const { setIsAppLoading } = React.useContext(Context);

  const { mutate: addSchedule } = useMutation(
    (payload: any) =>
      postData({
        url: "/api/schedule",
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      }),
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Schedule Added",
          description: `Schedule Added`,
        });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["schedule"] });
        const previousValues = queryClient.getQueryData(["schedule"]);
        queryClient.setQueryData(["schedule"], (oldData: any) =>
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
        queryClient.setQueryData(["schedule"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["schedule"] });
      },
    }
  );

  return (
    <Modal show={show} onClose={onClose} {...rest}>
      <div className="space-y-8">
        <div className="font-semibold text-3xl">Add New Schedule</div>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            values.patient_id = values.patient._id;
            values.doctor_id = values.doctor._id;
            values.branch_id = values.branch._id;
            values.schedule_type = values.schedule_type.key;
            values.room = values.room.name;
            if (!values.doctor_schedule_type) {
              values.doctor_schedule_type = "";
            }

            delete values.patient;
            delete values.doctor;
            delete values.branch;

            addSchedule(values);
          }}
          onFinishFailed={(data) => {
            scroller.scrollTo(data?.errorFields[0]?.name[0].toString(), {
              smooth: true,
              offset: -50,
              containerId: rest?.id,
            });
          }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Form.Item
              label="Type of Schedule"
              name="schedule_type"
              rules={[{ required: true, message: "This is required!" }]}
              required={false}
              className="col-span-4"
            >
              <Select
                placeholder="Patient Schedule"
                id="schedule_type"
                displayValueKey="name"
                onChange={(e: any) => setSchedType(e?.key)}
              >
                {scheduleType.map((props, index) => {
                  return (
                    <Select.Option value={props} key={index}>
                      {props.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            {schedType === "patient" && (
              <>
                <Form.Item
                  label="Patient Name / Email"
                  name="patient"
                  rules={[{ required: true, message: "This is required!" }]}
                  required={false}
                  className="col-span-4"
                >
                  <InfiniteAutoComplete
                    placeholder="Patient"
                    id="patient"
                    api={`${process.env.REACT_APP_API_BASE_URL}/api/patient?limit=3&for_dropdown=true&page=1`}
                    queryKey={["patient"]}
                    displayValueKey="name"
                    noData="No Patient Found"
                    customRender={
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                        className="p-4"
                      >
                        <Button
                          appearance="primary"
                          onClick={() => {
                            setIsPatientModalOpen(true);
                          }}
                        >
                          Add Patient
                        </Button>
                      </div>
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Reason for Visit"
                  name="reason_for_visit"
                  rules={[{ required: true, message: "This is required!" }]}
                  required={false}
                  className="col-span-4"
                >
                  <InfiniteSelect
                    placeholder="Select Reason for Visit"
                    id="reason_for_visit"
                    api={`${process.env.REACT_APP_API_BASE_URL}/api/procedure?limit=3&for_dropdown=true&page=1`}
                    queryKey={["procedure"]}
                  />
                </Form.Item>
                <Form.Item
                  label="Doctor"
                  name="doctor"
                  rules={[{ required: true, message: "This is required!" }]}
                  required={false}
                  className="col-span-4"
                >
                  <InfiniteSelect
                    placeholder="Select Doctor"
                    id="doctor"
                    api={`${process.env.REACT_APP_API_BASE_URL}/api/account?limit=3&for_dropdown=true&page=1`}
                    queryKey={["doctor"]}
                    displayValueKey="name"
                  />
                </Form.Item>
                <Form.Item
                  label="Branch"
                  name="branch"
                  rules={[{ required: true, message: "This is required!" }]}
                  required={false}
                  className="col-span-4"
                >
                  <InfiniteSelect
                    placeholder="Select Branch"
                    id="branch"
                    api={`${process.env.REACT_APP_API_BASE_URL}/api/branch?limit=3&for_dropdown=true&page=1`}
                    queryKey={["branch"]}
                    displayValueKey="name"
                  />
                </Form.Item>
                <Form.Item
                  label="Date"
                  name="date"
                  rules={[{ required: true, message: "Date is required" }]}
                  required={false}
                  className="col-span-2"
                >
                  <DatePicker
                    placeholder="Date"
                    id="date"
                    format="MMMM DD, YYYY"
                  />
                </Form.Item>
                <Form.Item
                  label="Time"
                  name="time"
                  rules={[{ required: true, message: "Time is required" }]}
                  required={false}
                  className="col-span-2"
                >
                  <TimePicker.RangePicker
                    id="time"
                    format="HH:mm"
                    minuteStep={15}
                  />
                </Form.Item>
                <Form.Item
                  label="Room"
                  name="room"
                  rules={[{ required: true, message: "This is required!" }]}
                  required={false}
                  className="col-span-4"
                >
                  <InfiniteSelect
                    placeholder="Select Branch"
                    id="branch"
                    api={`${process.env.REACT_APP_API_BASE_URL}/api/branch?limit=3&for_dropdown=true&page=1`}
                    queryKey={["branch"]}
                    displayValueKey="name"
                    CustomizedOption={({ data }: any) => {
                      return (
                        <div className="space-y-2">
                          <h6>{data.name}</h6>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <div>Doctor: Lorem Ipsum</div>
                            <div>Patient: Lorem Ipsum</div>
                            <div>Time Availability: Lorem Ipsum</div>
                          </div>
                        </div>
                      );
                    }}
                  />
                </Form.Item>
              </>
            )}

            {schedType === "doctor" && (
              <>
                <Form.Item
                  label="Doctor Name / Email"
                  name="doctor"
                  rules={[{ required: true, message: "This is required!" }]}
                  required={false}
                  className="col-span-4"
                >
                  <InfiniteAutoComplete
                    placeholder="Doctor"
                    id="doctor"
                    api={`${process.env.REACT_APP_API_BASE_URL}/api/account?limit=3&for_dropdown=true&page=1`}
                    queryKey={["doctor"]}
                    displayValueKey="name"
                    noData="No Doctor Found"
                  />
                </Form.Item>
                <Form.Item
                  label="Reason for Leave"
                  name="doctor_schedule_type"
                  rules={[{ required: true, message: "This is required!" }]}
                  required={false}
                  className="col-span-4"
                >
                  <Select
                    placeholder="Reason for Leave"
                    id="doctor_schedule_type"
                  >
                    {leaveReasons.map((props, index) => {
                      return (
                        <Select.Option value={props.name} key={index}>
                          {props.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Branch"
                  name="branch"
                  rules={[{ required: true, message: "This is required!" }]}
                  required={false}
                  className="col-span-4"
                >
                  <InfiniteSelect
                    placeholder="Select Branch"
                    id="branch"
                    api={`${process.env.REACT_APP_API_BASE_URL}/api/branch?limit=3&for_dropdown=true&page=1`}
                    queryKey={["branch"]}
                    displayValueKey="name"
                  />
                </Form.Item>
                <Form.Item
                  label="Date"
                  name="date"
                  rules={[{ required: true, message: "Date is required" }]}
                  required={false}
                  className="col-span-2"
                >
                  <DatePicker
                    placeholder="Date"
                    id="date"
                    format="MMMM DD, YYYY"
                  />
                </Form.Item>
                <Form.Item
                  label="Time"
                  name="time"
                  rules={[{ required: true, message: "Time is required" }]}
                  required={false}
                  className="col-span-2"
                >
                  <TimePicker.RangePicker
                    id="time"
                    format="HH:mm"
                    minuteStep={15}
                  />
                </Form.Item>
              </>
            )}
          </div>
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
