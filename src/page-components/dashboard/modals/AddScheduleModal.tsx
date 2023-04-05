import React from "react";
import Form from "antd/lib/form";
import Input from "../../../components/Input";
import { Button } from "../../../components/Button";
import "chart.js/auto";
import { Select } from "../../../components/Select";
import Modal from "../../../components/Modal";
import { PatternFormat } from "react-number-format";
import { scroller } from "react-scroll";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchData, postData } from "../../../../utils/api";
import { DatePicker, TimePicker, notification } from "antd";
import { Context } from "../../../../utils/context/Provider";
import { InfiniteSelect } from "../../../components/InfiniteSelect";
import scheduleType from "../../../../utils/global-data/scheduleType";
import { InfiniteAutoComplete } from "../../../components/InfiniteAutoComplete";
import leaveReasons from "../../../../utils/global-data/leaveReasons";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import { getInitialValue } from "../../../../utils/helpers";

export default function AddScheduleModal({
  show,
  onClose,
  form,
  setIsPatientModalOpen,
  ...rest
}: any) {
  const queryClient = useQueryClient();
  const { setIsAppLoading } = React.useContext(Context);

  let [schedType, setSchedType] = React.useState("");
  let [selectedBranch, setSelectedBranch] = React.useState("");
  let [selectedDate, setSelectedDate] = React.useState(null);
  let [selectedDoctor, setSelectedDoctor] = React.useState("");
  let [selectedStartTime, setSelectedStartTime] = React.useState<any>(null);

  const {
    data: doctorSchedule,
    isFetching: isDoctorScheduleLoading,
  } = useQuery(
    ["doc", selectedDoctor, selectedDate],
    () =>
      fetchData({
        url: `/api/schedule/doctor?doctor_id=${selectedDoctor}&date=${
          selectedDate ? moment(selectedDate).format("YYYY-MM-DD") : ""
        }`,
      }),
    {
      initialData: [],
      enabled: selectedDoctor && selectedDate ? true : false,
    }
  );

  function range(start: number, end: number, precise?: boolean) {
    const result = [];
    if (precise) {
      for (let i = start; i <= end; i++) {
        result.push(i);
      }
    } else {
      for (let i = start; i < end; i++) {
        result.push(i);
      }
    }

    return result;
  }

  function checkSelectedHour(dateArrays: any, selectedHour: any) {
    let checker = dateArrays.find(({ start, end }: any) => {
      return (
        moment(start, "HH:mm").hour() === selectedHour ||
        moment(end, "HH:mm").hour() === selectedHour
      );
    });

    let checkerList = [checker?.start, checker?.end];

    let getNearestFromChecker = checkerList.find((hour) => {
      return moment(hour, "HH:mm").hour() === selectedHour;
    });

    let checkValue = checkerList
      .map((hour, index) => {
        if (getNearestFromChecker === hour)
          return {
            hour: hour,
            index: index,
          };
      })
      .filter((hour) => hour);

    return checkValue[0];
  }

  function disabledRangeTime(_: any, type: "start" | "end") {
    let mergedSelectedToArray = [
      ...doctorSchedule,
      {
        start: null,
        end: moment(selectedStartTime).format("HH:mm"),
      },
    ];

    if (type === "start") {
      let startDisabledDates = doctorSchedule
        .map(({ start_time, end_time }: any) => {
          return range(
            moment(start_time, "HH:mm").hour(),
            moment(end_time, "HH:mm").hour()
          );
        })
        .flat();

      return {
        disabledHours: () => startDisabledDates,
        disabledMinutes: (selectedHour: number) => {
          if (
            checkSelectedHour(doctorSchedule, selectedHour)?.index &&
            moment(
              checkSelectedHour(doctorSchedule, selectedHour)?.hour,
              "HH:mm"
            ).hour() === selectedHour
          ) {
            return range(
              moment(0).minute(),
              moment(
                checkSelectedHour(doctorSchedule, selectedHour)?.hour,
                "HH:mm"
              ).minute()
            );
          } else if (
            !checkSelectedHour(doctorSchedule, selectedHour)?.index &&
            moment(
              checkSelectedHour(doctorSchedule, selectedHour)?.hour,
              "HH:mm"
            ).hour() === selectedHour
          ) {
            return range(
              moment(
                checkSelectedHour(doctorSchedule, selectedHour)?.hour,
                "HH:mm"
              ).minute(),
              60
            );
          }
          return [];
        },
      };
    } else {
      let removeHours = range(0, 24).filter((num) => {
        if (
          // if lower than min start date
          moment(selectedStartTime, "HH:mm").hour() <
          Math.min(
            ...doctorSchedule.map(({ start_time }: any) => {
              return moment(start_time, "HH:mm").hour();
            })
          )
        ) {
          return (
            num >= moment(selectedStartTime, "HH:mm").hour() &&
            num <
              Math.min(
                ...doctorSchedule.map(({ start_time }: any) => {
                  return moment(start_time, "HH:mm").hour();
                })
              )
          );
        } else if (
          // if higher than max end date
          moment(selectedStartTime, "HH:mm").hour() >=
          Math.max(
            ...doctorSchedule.map(({ end_time }: any) => {
              return moment(end_time, "HH:mm").hour();
            })
          )
        ) {
          return num >= moment(selectedStartTime, "HH:mm").hour();
        } else {
          // if in middle of disabled dates

          let nearestStartTime = doctorSchedule.find(({ start_time }: any) => {
            return (
              moment(selectedStartTime, "HH:mm").hour() <
              moment(start_time, "HH:mm").hour()
            );
          })?.start_time;

          return (
            num >= moment(selectedStartTime, "HH:mm").hour() &&
            num <= moment(nearestStartTime, "HH:mm").hour()
          );
        }
      });

      let disabledHours = range(0, 24).filter((nums) => {
        return !removeHours.includes(nums);
      });

      // console.log(removeHours);

      return {
        disabledHours: () => disabledHours,
        disabledMinutes: (selectedHour: number) => {
          if (selectedHour < 0) {
            return range(0, 60);
          } else if (
            checkSelectedHour(mergedSelectedToArray, selectedHour)?.index &&
            moment(
              checkSelectedHour(mergedSelectedToArray, selectedHour)?.hour,
              "HH:mm"
            )
          ) {
            return range(
              0,
              moment(
                checkSelectedHour(mergedSelectedToArray, selectedHour)?.hour,
                "HH:mm"
              ).minute(),
              true
            );
          } else if (
            !checkSelectedHour(mergedSelectedToArray, selectedHour)?.index &&
            moment(
              checkSelectedHour(mergedSelectedToArray, selectedHour)?.hour,
              "HH:mm"
            )
          ) {
            return range(
              moment(
                checkSelectedHour(mergedSelectedToArray, selectedHour)?.hour,
                "HH:mm"
              ).minute(),
              60,
              true
            );
          }

          return [];
        },
      };
    }
  }

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
    if (show) {
      setSchedType(form.getFieldValue(["schedule_type"]));
      setSelectedBranch(form.getFieldValue(["branch_id"]));
    }

    if (!show) {
      setSchedType("");
      setSelectedBranch("");
      setSelectedDate(null);
      setSelectedDoctor("");
      setSelectedStartTime(null);

      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <Modal show={show} onClose={onClose} {...rest}>
      <div className="space-y-8">
        <div className="font-bold text-3xl">Add New Schedule</div>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            let id = form.getFieldValue("_id");

            values.start_time = moment(values.time[0]).format("HH:mm");
            values.end_time = moment(values.time[1]).format("HH:mm");
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
            </Form.Item>
            {schedType === "patient" && (
              <>
                <Form.Item
                  label="Patient Name / Email"
                  name="patient_id"
                  rules={[{ required: true, message: "This is required!" }]}
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
                  name="reason_for_visit"
                  rules={[{ required: true, message: "This is required!" }]}
                  required={false}
                  className="col-span-4"
                >
                  <InfiniteSelect
                    placeholder="Select Reason for Visit"
                    id="reason_for_visit"
                    api={`${process.env.REACT_APP_API_BASE_URL}/api/procedure?limit=3&for_dropdown=true&page=1`}
                    getInitialValue={{
                      form,
                      initialValue: "reason_for_visit",
                    }}
                    queryKey={["procedure"]}
                    displayValueKey="name"
                    returnValueKey="_id"
                  />
                </Form.Item>
                <Form.Item
                  label="Doctor"
                  name="doctor_id"
                  rules={[{ required: true, message: "This is required!" }]}
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
                    queryKey={["doctor"]}
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
                  rules={[{ required: true, message: "This is required!" }]}
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
                    onChange={(e) => {
                      setSelectedBranch(e);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Date"
                  name="date"
                  rules={[{ required: true, message: "Date is required" }]}
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
                    disabled={!selectedDoctor}
                  />
                </Form.Item>
                <Form.Item
                  label="Time"
                  name="time"
                  rules={[{ required: true, message: "Time is required" }]}
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
                  <TimePicker.RangePicker
                    id="time"
                    format="HH:mm"
                    minuteStep={15}
                    disabledTime={disabledRangeTime}
                    disabled={!selectedDate}
                    order={false}
                    onFocus={(e: any) => {
                      if (e?.relatedTarget?.id === "time") {
                        setSelectedStartTime(e.relatedTarget.value);
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Room"
                  name="clinic_room"
                  rules={[{ required: true, message: "This is required!" }]}
                  required={false}
                  className="col-span-4"
                >
                  <InfiniteSelect
                    placeholder="Select Room"
                    id="clinic_room"
                    api={`${process.env.REACT_APP_API_BASE_URL}/api/room?branch_id=${selectedBranch}&limit=3&for_dropdown=true&page=1`}
                    getInitialValue={{
                      form,
                      initialValue: "clinic_room",
                    }}
                    queryKey={["clinic_room", selectedBranch]}
                    displayValueKey="name"
                    returnValueKey="_id"
                    disabled={!selectedBranch}
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
                <Form.Item
                  label="Remarks"
                  name="remarks"
                  // rules={[{ required: true, message: "Remarks is required" }]}
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

            {schedType === "doctor" && (
              <>
                <Form.Item
                  label="Doctor Name / Email"
                  name="doctor_id"
                  rules={[{ required: true, message: "This is required!" }]}
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
                  name="branch_id"
                  rules={[{ required: true, message: "This is required!" }]}
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
                    onChange={(e) => {
                      setSelectedBranch(e);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Date"
                  name="date"
                  rules={[{ required: true, message: "Date is required" }]}
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
                    disabled={!selectedDoctor}
                  />
                </Form.Item>
                <Form.Item
                  label="Time"
                  name="time"
                  rules={[{ required: true, message: "Time is required" }]}
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
                  <TimePicker.RangePicker
                    id="time"
                    format="HH:mm"
                    minuteStep={15}
                    disabledTime={disabledRangeTime}
                    disabled={!selectedDate}
                    order={false}
                    onFocus={(e: any) => {
                      if (e?.relatedTarget?.id === "time") {
                        setSelectedStartTime(e.relatedTarget.value);
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Room"
                  name="clinic_room"
                  rules={[{ required: true, message: "This is required!" }]}
                  required={false}
                  className="col-span-4"
                >
                  <InfiniteSelect
                    placeholder="Select Room"
                    id="clinic_room"
                    api={`${process.env.REACT_APP_API_BASE_URL}/api/room?branch_id=${selectedBranch}&limit=3&for_dropdown=true&page=1`}
                    getInitialValue={{
                      form,
                      initialValue: "clinic_room",
                    }}
                    queryKey={["clinic_room", selectedBranch]}
                    displayValueKey="name"
                    returnValueKey="_id"
                    disabled={!selectedBranch}
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
                <Form.Item
                  label="Remarks"
                  name="remarks"
                  rules={[{ required: true, message: "Remarks is required" }]}
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
