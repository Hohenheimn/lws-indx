import React, { useEffect, useState } from "react";
import { DatePicker, TimePicker, notification } from "antd";
import Form from "antd/lib/form";
import TextArea from "antd/lib/input/TextArea";
import "chart.js/auto";
import {
  parse,
  differenceInHours,
  getHours,
  isBefore,
  isAfter,
} from "date-fns";
import moment from "moment";
import { PatternFormat } from "react-number-format";
import { scroller } from "react-scroll";
import { Button } from "@components/Button";
import { InfiniteAutoComplete } from "@components/InfiniteAutoComplete";
import { InfiniteSelect } from "@components/InfiniteSelect";
import Input from "@components/Input";
import Modal from "@components/Modal";
import { Select } from "@components/Select";
import TimeRangePicker, {
  generateTimeSlots,
} from "@src/components/TimeRangePicker";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData, postData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import leaveReasons from "@utilities/global-data/leaveReasons";
import scheduleType from "@utilities/global-data/scheduleType";
import { getInitialValue } from "@utilities/helpers";

import AddPatientModal from "./AddPatientModal";

type BlockTime = { start: string; end: string };

export default function AddScheduleModal({
  show,
  onClose,
  form,
  profile,
  ...rest
}: any) {
  const queryClient = useQueryClient();

  const [RegistrationForm] = Form.useForm();

  const { setIsAppLoading } = React.useContext(Context);

  const [isPatientModalOpen, setIsPatientModalOpen] = React.useState(false);

  const [schedType, setSchedType] = React.useState("patient");

  const [selectedBranch, setSelectedBranch] = React.useState<
    | {
        name: string;
        schedules: { day: string; open_time: string; close_time: string }[];
        _id: string;
        chair_quantity: string;
      }
    | undefined
  >(undefined);

  const [selectedDate, setSelectedDate] = React.useState<any>(null);

  const [selectedDoctor, setSelectedDoctor] = React.useState("");

  let { data: doctorSchedules } = useQuery(
    ["schedule-dates", selectedDoctor],
    () =>
      fetchData({
        url: `/api/schedule?doctor_id=${selectedDoctor}`,
      })
  );

  React.useEffect(() => {
    form.setFieldsValue({
      ...form,
      time:
        form?.getFieldValue("start_time") && form?.getFieldValue("end_time")
          ? [form?.getFieldValue("start_time"), form?.getFieldValue("end_time")]
          : [],
    });
  }, [show]);

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
        onClose();
        setSelectedBranch(undefined);
        setSelectedDate(null);
        setSelectedDoctor("");
        form.resetFields();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["schedule"] });
        const previousValues = queryClient.getQueryData(["schedule"]);

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
        queryClient.invalidateQueries({ queryKey: ["schedule-dates"] });
      },
    }
  );

  const { mutate: editSchedule } = useMutation(
    (payload: any) => {
      return postData({
        url: `/api/schedule/${payload.id}?_method=PUT`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Editing Schedule Success",
          description: `Editing Schedule Success`,
        });
        onClose();
        setSelectedBranch(undefined);
        setSelectedDate(null);
        setSelectedDoctor("");
        form.resetFields();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["schedule"] });
        const previousValues = queryClient.getQueryData(["schedule"]);
        // queryClient.setQueryData(["schedule"], (oldData: any) =>
        //   oldData ? [...oldData, newData] : undefined
        // );

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

  React.useEffect(() => {
    if (!show) {
      // setSchedType("");
      setSelectedDate(null);
      setSelectedDoctor("");
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  // Disable date and time depends on doctors schedule
  let [isDoctorSchedules, setDoctorSchedules] = React.useState<
    {
      date: string;
      covered_time: number;
      start_time: string;
      end_time: string;
    }[]
  >([]);

  let [isTime, setTime] = React.useState<BlockTime[]>([]);

  React.useEffect(() => {
    if (doctorSchedules) {
      const get = doctorSchedules.map((item: any, index: number) => {
        const startTime = parse(
          `${item.date} ${item.start_time}`,
          "yyyy-MM-dd hh:mm a",
          new Date()
        );
        const endTime = parse(
          `${item.date} ${item.end_time}`,
          "yyyy-MM-dd hh:mm a",
          new Date()
        );
        const coveredTime = differenceInHours(endTime, startTime);
        return {
          date: item.date,
          covered_time: coveredTime,
          start_time: item.start_time,
          end_time: item.end_time,
        };
      });
      setDoctorSchedules(get);
    }
  }, [doctorSchedules]);

  const [dentalChairSelectOption, setDentalChairSelectOption] = useState<
    number[]
  >([]);

  const [isOutsideRange, setOutsideRange] = useState<string[]>([]);

  useEffect(() => {
    if (selectedDate !== null) {
      const formattedCurrent = selectedDate.format("yyyy-MM-DD");
      // Get time that need to block from schedule
      const getByFilter = isDoctorSchedules.filter(
        (filter) => filter.date === formattedCurrent
      );
      const fromSchedule: BlockTime[] = getByFilter.map((item) => {
        return { start: item.start_time, end: item.end_time, day: null };
      });
      setTime(fromSchedule);

      // Get time that need to block that outside of the schedule time range
      const selectedDateFormat = selectedDate.format("dddd");
      let TimesOutside: string[] = [];
      selectedBranch?.schedules?.map((itemSchedule) => {
        if (selectedDateFormat === itemSchedule.day) {
          const startHour = parse(
            itemSchedule.open_time,
            "hh:mm a",
            new Date()
          );
          const closeHour = parse(
            itemSchedule.close_time,
            "hh:mm a",
            new Date()
          );
          const timeSlot = generateTimeSlots();
          timeSlot.map((itemTime) => {
            const current = parse(itemTime, "hh:mm a", new Date());
            const isOutsideRange =
              isBefore(current, startHour) || isAfter(current, closeHour);
            if (isOutsideRange) {
              TimesOutside = [...TimesOutside, itemTime];
            }
          });
        }
      });
      setOutsideRange(TimesOutside);
    }
    let dentalchair: number[] = [];
    for (let i = 1; i <= Number(selectedBranch?.chair_quantity); i++) {
      dentalchair = [...dentalchair, i];
    }
    setDentalChairSelectOption(dentalchair);
  }, [selectedDate, selectedBranch]);

  const disabledDate = (current: any) => {
    // selected date
    const formattedCurrent = current.format("yyyy-MM-DD");
    const formarttedToDay = current.format("dddd");
    if (
      !selectedBranch?.schedules?.some((some) => some.day === formarttedToDay)
    ) {
      return true;
    }
    if (
      isDoctorSchedules.some(
        (someitem) =>
          someitem.date === formattedCurrent && someitem.covered_time >= 10
      ) ||
      current < moment().startOf("day")
    ) {
      return true;
    }
    return false;
  };

  return (
    <Modal
      show={show}
      onClose={() => {
        setSelectedBranch(undefined);
        setSelectedDate(null);
        setSelectedDoctor("");
        onClose();
      }}
      {...rest}
    >
      <div className="space-y-8">
        <div className="font-bold text-3xl">Add New Schedule</div>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            let id = form.getFieldValue("_id");
            values.schedule_type = "patient";
            values.start_time = values.time[0];
            values.end_time = values.time[1];
            delete values.time;
            values.date = moment(values.date).format("YYYY-MM-DD");
            if (!id) {
              addSchedule(values);
            } else {
              values.id = id;
              editSchedule(values);
            }
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
            {/* <Form.Item
              label="Type of Schedule"
              name="schedule_type"
              rules={[
                {
                  required: true,
                  message: "This is required!",
                },
              ]}
              required={false}
              className="col-span-4"
            >
              <Select
                placeholder="Patient Schedule"
                id="schedule_type"
                onChange={(e: any) => setSchedType(e)}
              >
                {scheduleType.map((props, index) => {
                  return (
                    <Select.Option
                      displayValue={props.name}
                      value={props.key}
                      key={index}
                    >
                      {props.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item> */}
            {schedType === "patient" && (
              <>
                <Form.Item
                  label="Patient Name / Email"
                  name="patient_id"
                  rules={[
                    {
                      required: true,
                      message: "This is required!",
                    },
                  ]}
                  required={false}
                  className="col-span-4"
                >
                  <InfiniteAutoComplete
                    placeholder="Patient"
                    id="patient_id"
                    api={`${
                      process.env.REACT_APP_API_BASE_URL
                    }/api/patient?limit=3&for_dropdown=true&page=1${getInitialValue(
                      form,
                      "patient_id"
                    )}`}
                    queryKey={["patient", form.getFieldValue(["patient_id"])]}
                    displayValueKey="name"
                    returnValueKey="_id"
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
                  name="reason_for_visit_id"
                  rules={[
                    {
                      required: true,
                      message: "This is required!",
                    },
                  ]}
                  required={false}
                  className="col-span-4"
                >
                  <InfiniteSelect
                    placeholder="Select Reason for Visit"
                    id="reason_for_visit_id"
                    api={`${process.env.REACT_APP_API_BASE_URL}/api/procedure?limit=3&for_dropdown=true&page=1`}
                    queryKey={["procedure"]}
                    displayValueKey="name"
                    returnValueKey="_id"
                  />
                </Form.Item>
                <Form.Item
                  label="Doctor"
                  name="doctor_id"
                  rules={[
                    {
                      required: true,
                      message: "This is required!",
                    },
                  ]}
                  required={false}
                  className="col-span-4"
                >
                  <InfiniteSelect
                    placeholder="Select Doctor"
                    id="doctor_id"
                    api={`${process.env.REACT_APP_API_BASE_URL}/api/account?limit=3&for_dropdown=true&page=1`}
                    getInitialValue={{
                      form,
                      initialValue: "doctor_id",
                    }}
                    queryKey={["account"]}
                    displayValueKey="name"
                    returnValueKey="_id"
                    onChange={(e) => {
                      setSelectedDoctor(e);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Branch"
                  name="branch_id"
                  rules={[
                    {
                      required: true,
                      message: "This is required!",
                    },
                  ]}
                  required={false}
                  className="col-span-4"
                >
                  <InfiniteSelect
                    placeholder="Select Branch"
                    id="branch_id"
                    api={`${process.env.REACT_APP_API_BASE_URL}/api/branch?limit=3&for_dropdown=true&page=1`}
                    getInitialValue={{
                      form,
                      initialValue: "branch_id",
                    }}
                    queryKey={["branch"]}
                    displayValueKey="name"
                    returnValueKey="_id"
                    setSelectedDetail={setSelectedBranch}
                    onChange={(e: any) =>
                      e === "" && setSelectedBranch(undefined)
                    }
                  />
                </Form.Item>

                <Form.Item
                  label="Dental Chair"
                  name="dental_chair"
                  rules={[
                    {
                      required: true,
                      message: "This is required!",
                    },
                  ]}
                  required={false}
                  className="col-span-4"
                >
                  <Select
                    id="dental_chair"
                    placeholder="Select chair"
                    className="border-transparent"
                    disabled={selectedBranch === undefined}
                    noFilter={true}
                  >
                    {dentalChairSelectOption.map((item, index) => (
                      <Select.Option value={`Chair No. ${item}`} key={index}>
                        Chair No. {item}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  label="Date"
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: "Date is required",
                    },
                  ]}
                  required={false}
                  className="col-span-4 md:col-span-2"
                >
                  <DatePicker
                    placeholder="Date"
                    id="date"
                    format="MMMM DD, YYYY"
                    onChange={(value: any) => {
                      setSelectedDate(value);
                    }}
                    disabledDate={disabledDate}
                    disabled={selectedBranch === undefined}
                  />
                </Form.Item>
                <Form.Item
                  label="Time"
                  name="time"
                  rules={[
                    {
                      required: true,
                      message: "Time is required",
                    },
                  ]}
                  required={false}
                  className="col-span-4 md:col-span-2"
                  getValueFromEvent={(e) => {
                    if (e) {
                      if (moment(e[0]).isSameOrAfter(moment(e[1]))) {
                        return [e[0], null];
                      }

                      return e;
                    }
                  }}
                >
                  <TimeRangePicker
                    onChange={(value) => {
                      form.setFieldValue("time", value);
                    }}
                    isTime={isTime}
                    disabled={selectedBranch === undefined}
                    blockOutSide={isOutsideRange}
                    filterByOutSideTime={true}
                  />
                </Form.Item>

                <Form.Item
                  label="Remarks"
                  name="remarks"
                  required={false}
                  className="col-span-4"
                  initialValue={""}
                >
                  <TextArea
                    id="remarks"
                    placeholder="Remarks"
                    rows={8}
                    className="!border-2"
                  />
                </Form.Item>
              </>
            )}

            {schedType === "doctor" && (
              <>
                <Form.Item
                  label="Doctor Name / Email"
                  name="doctor_id"
                  rules={[
                    {
                      required: true,
                      message: "This is required!",
                    },
                  ]}
                  required={false}
                  className="col-span-4"
                >
                  <InfiniteAutoComplete
                    placeholder="Doctor"
                    id="doctor_id"
                    api={`${
                      process.env.REACT_APP_API_BASE_URL
                    }/api/account?limit=3&for_dropdown=true&page=1${getInitialValue(
                      form,
                      "doctor_id"
                    )}`}
                    queryKey={["doctor"]}
                    displayValueKey="name"
                    returnValueKey="_id"
                    noData="No Doctor Found"
                    onChange={(e) => {
                      setSelectedDoctor(e);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Reason for Leave"
                  name="doctor_schedule_type"
                  rules={[
                    {
                      required: true,
                      message: "This is required!",
                    },
                  ]}
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
                  name="branch_id"
                  rules={[
                    {
                      required: true,
                      message: "This is required!",
                    },
                  ]}
                  required={false}
                  className="col-span-4"
                >
                  <InfiniteSelect
                    placeholder="Select Branch"
                    id="branch_id"
                    api={`${process.env.REACT_APP_API_BASE_URL}/api/branch?limit=3&for_dropdown=true&page=1`}
                    getInitialValue={{
                      form,
                      initialValue: "branch_id",
                    }}
                    queryKey={["branch"]}
                    displayValueKey="name"
                    returnValueKey="_id"
                    setSelectedDetail={setSelectedBranch}
                  />
                </Form.Item>
                <Form.Item
                  label="Date"
                  name="date"
                  rules={[
                    {
                      required: true,
                      message: "Date is required",
                    },
                  ]}
                  required={false}
                  className="col-span-4 md:col-span-2"
                >
                  <DatePicker
                    getPopupContainer={(triggerNode: any) => {
                      return triggerNode.parentNode;
                    }}
                    placeholder="Date"
                    id="date"
                    format="MMMM DD, YYYY"
                    onChange={(value: any) => {
                      form.setFieldsValue({ time: [] });
                      setSelectedDate(value);
                    }}
                    disabledDate={disabledDate}
                  />
                </Form.Item>
                <Form.Item
                  label="Time"
                  name="time"
                  rules={[
                    {
                      required: true,
                      message: "Time is required",
                    },
                  ]}
                  required={false}
                  className="col-span-4 md:col-span-2"
                  getValueFromEvent={(e) => {
                    if (e) {
                      if (moment(e[0]).isSameOrAfter(moment(e[1]))) {
                        return [e[0], null];
                      }

                      return e;
                    }
                  }}
                >
                  <TimeRangePicker
                    onChange={(value) => {
                      form.setFieldValue("time", value);
                    }}
                    isTime={isTime}
                  />
                </Form.Item>
                <Form.Item
                  label="Dental Chair"
                  name="dental_chair"
                  rules={[
                    {
                      required: true,
                      message: "This is required!",
                    },
                  ]}
                  required={false}
                  className="col-span-4"
                >
                  <Select
                    id="dental_chair"
                    placeholder="Select chair"
                    className="border-transparent"
                  >
                    <Select.Option value="Chair No. 1" key="Chair No. 1">
                      Chair No. 1
                    </Select.Option>
                    <Select.Option value="Chair No. 2" key="Chair No. 2">
                      Chair No. 2
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Remarks"
                  name="remarks"
                  rules={[
                    {
                      required: true,
                      message: "Remarks is required",
                    },
                  ]}
                  required={false}
                  className="col-span-4"
                >
                  <TextArea
                    id="remarks"
                    placeholder="Remarks"
                    rows={8}
                    className="!border-2"
                  />
                </Form.Item>
              </>
            )}
          </div>
          <div className="flex justify-center md:justify-end items-center gap-4">
            <Button
              appearance="link"
              className="p-4 bg-transparent border-none text-casper-500 font-semibold"
              onClick={() => {
                setSelectedBranch(undefined);
                setSelectedDate(null);
                setSelectedDoctor("");
                onClose();
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
      </div>

      <AddPatientModal
        show={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        className="w-[80rem]"
        id="patient-modal"
        form={RegistrationForm}
        profile={profile}
      />
    </Modal>
  );
}
