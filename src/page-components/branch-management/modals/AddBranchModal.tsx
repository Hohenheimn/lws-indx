import React from "react";
import { DatePicker, Form, TimePicker, notification } from "antd";
import Input from "../../../components/Input";
import { Button } from "../../../components/Button";
import { Select } from "../../../components/Select";
import Modal from "../../../components/Modal";
import { NumericFormat, PatternFormat } from "react-number-format";
import { scroller } from "react-scroll";
import Uploader from "../../../components/Uploader";
import Avatar from "../../../components/Avatar";
import { IoPersonOutline } from "react-icons/io5";
import Image from "next/image";
import gender from "../../../../utils/global-data/gender";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData, updateData } from "../../../../utils/api";
import { Context } from "../../../../utils/context/Provider";
import { differenceInYears, parse, parseISO, format } from "date-fns";
import moment from "moment";
import { IoMdAddCircle } from "react-icons/io";
import { AnimateContainer } from "../../../components/animation";
import { fadeIn } from "../../../components/animation/animation";
import { AiFillMinusCircle } from "react-icons/ai";
import days from "../../../../utils/global-data/days";

export default function AddBranchModal({ show, onClose, form, ...rest }: any) {
  const queryClient = useQueryClient();
  const { setIsAppLoading } = React.useContext(Context);

  const { mutate: addBranch } = useMutation(
    (payload: any) => {
      return postData({
        url: "/api/branch",
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Adding Branch Success",
          description: `Adding Branch Success`,
        });
        form.resetFields();
        onClose();
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

  const { mutate: editBranch } = useMutation(
    (payload: any) => {
      return updateData({
        url: `/api/branch/${payload.id}`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Editing Branch Success",
          description: `Editing Branch Success`,
        });
        form.resetFields();
        onClose();
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

  return (
    <Modal show={show} onClose={onClose} {...rest}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-3xl">Add Clinic Branch</div>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            let id = form.getFieldsValue(["_id"])._id;
            values.schedules.map((row: any, index: any) => {
              values.schedules[index].open_time =
                row.opening_time.format("HH:mm:ss");
              values.schedules[index].close_time =
                row.closing_time.format("HH:mm:ss");
            });

            values.rooms = JSON.stringify(values.rooms);
            values.schedules = JSON.stringify(values.schedules);

            if (!id) {
              addBranch(values);
            } else {
              values.id = id;
              editBranch(values);
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
          <div className="space-y-4">
            <h4>Branch Info</h4>
            <div className="grid lg:grid-cols-3 gap-4">
              <Form.Item
                label="Branch Name"
                name="name"
                rules={[{ required: true, message: "This is required!" }]}
                required={false}
                className="col-span-3 lg:col-span-1"
              >
                <Input id="name" placeholder="Branch Name" />
              </Form.Item>
              <Form.Item
                label="Mobile Number"
                name="mobile_no"
                rules={[
                  { required: true, message: "This is required!" },
                  {
                    pattern: /^(09)\d{2}-\d{3}-\d{4}$/,
                    message: "Please use correct format!",
                  },
                ]}
                required={false}
                className="col-span-3 lg:col-span-1"
              >
                <PatternFormat
                  customInput={Input}
                  placeholder="09XX-XXX-XXXXX"
                  mask="X"
                  format="####-###-####"
                  allowEmptyFormatting={false}
                  id="mobile_no"
                />
              </Form.Item>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "This is required!" },
                  { type: "email", message: "Must be a valid email" },
                ]}
                required={false}
                className="col-span-3 lg:col-span-1"
              >
                <Input id="email" placeholder="juandelacruz@xxxxx.xxx" />
              </Form.Item>
            </div>
          </div>
          <div className="space-y-4">
            <h4>Address</h4>
            <div className="grid grid-cols-3 gap-4">
              <Form.Item
                label="Street"
                name="street"
                rules={[{ required: true, message: "Street is required" }]}
                required={false}
                className="col-span-3 lg:col-span-2"
              >
                <Input id="street" placeholder="Add street name" />
              </Form.Item>
              <Form.Item
                label="Barangay"
                name="barangay"
                rules={[{ required: true, message: "Barangay is required" }]}
                required={false}
                className="col-span-3 lg:col-span-1"
              >
                <Input id="barangay" placeholder="Barangay" />
              </Form.Item>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "City is required" }]}
                required={false}
                className="col-span-3 lg:col-span-1"
              >
                <Select placeholder="Select City" id="city">
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Region"
                name="region"
                rules={[{ required: true, message: "Region is required" }]}
                required={false}
                className="col-span-3 lg:col-span-1"
              >
                <Select placeholder="Select Region" id="region">
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Country"
                name="country"
                rules={[{ required: true, message: "Country is required" }]}
                required={false}
                className="col-span-3 lg:col-span-1"
              >
                <Select placeholder="Select Country" id="country">
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Zip Code"
                name="zip_code"
                rules={[{ required: true, message: "Zip Code is required" }]}
                required={false}
                className="col-span-3 lg:col-span-1"
              >
                <NumericFormat
                  customInput={Input}
                  id="zip_code"
                  allowNegative={false}
                  placeholder="Zip Code"
                />
              </Form.Item>
            </div>
          </div>
          <div className="space-y-4">
            <h4>Clinic Rooms</h4>
            <div className="grid grid-cols-1 gap-4">
              <Form.List name="rooms" initialValue={[{}]}>
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map(({ name, key, ...rest }) => {
                        return (
                          <AnimateContainer
                            variants={fadeIn}
                            key={key}
                            triggerOnce={true}
                          >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 border border-gray-300 p-4 pt-8 rounded-md relative">
                              {fields.length > 1 ? (
                                <AiFillMinusCircle
                                  className="absolute top-0 right-0 m-2 text-danger text-3xl cursor-pointer"
                                  onClick={() => remove(name)}
                                />
                              ) : null}

                              <Form.Item
                                label="Room Name"
                                name={[name, "name"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "This is required!",
                                  },
                                ]}
                                required={false}
                              >
                                <Input
                                  placeholder="Room Name"
                                  id={["rooms", name, "name"].join("-")}
                                />
                              </Form.Item>
                            </div>
                          </AnimateContainer>
                        );
                      })}
                      <div className="border border-gray-300 p-4 pt-8 rounded-md relative">
                        <div className="blur-sm grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <Form.Item
                            label="Days"
                            required={false}
                            {...rest}
                            className="col-span-3 lg:col-span-1"
                          >
                            <Select placeholder="Days">
                              {days.map((day, index) => {
                                return (
                                  <Select.Option value={day} key={index}>
                                    {day}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            label="Opening Time"
                            required={false}
                            className="col-span-3 lg:col-span-1"
                          >
                            <TimePicker format="HH:mm" minuteStep={15} />
                          </Form.Item>
                          <Form.Item label="Closing Time" required={false}>
                            <TimePicker
                              format="HH:mm"
                              minuteStep={15}
                              className="col-span-3 lg:col-span-1"
                            />
                          </Form.Item>
                        </div>
                        <div
                          className="absolute top-0 left-0 h-full w-full flex justify-center items-center cursor-pointer"
                          onClick={() => add()}
                        >
                          <IoMdAddCircle className="text-7xl text-primary" />
                        </div>
                      </div>
                    </>
                  );
                }}
              </Form.List>
            </div>
          </div>
          <div className="space-y-4">
            <h4>Clinic Schedule</h4>
            <div className="grid grid-cols-1 gap-4">
              <Form.List name="schedules" initialValue={[{}]}>
                {(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map(({ name, key, ...rest }) => {
                        return (
                          <AnimateContainer
                            variants={fadeIn}
                            key={key}
                            triggerOnce={true}
                          >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 border border-gray-300 p-4 pt-8 rounded-md relative">
                              {fields.length > 1 ? (
                                <AiFillMinusCircle
                                  className="absolute top-0 right-0 m-2 text-danger text-3xl cursor-pointer"
                                  onClick={() => remove(name)}
                                />
                              ) : null}
                              <Form.Item
                                label="Days"
                                name={[name, "day"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "This is required!",
                                  },
                                ]}
                                required={false}
                                {...rest}
                              >
                                <Select
                                  placeholder="Days"
                                  id={["schedules", name, "day"].join("-")}
                                >
                                  {days.map((day, index) => {
                                    return (
                                      <Select.Option value={day} key={index}>
                                        {day}
                                      </Select.Option>
                                    );
                                  })}
                                </Select>
                              </Form.Item>
                              <Form.Item
                                label="Opening Time"
                                name={[name, "opening_time"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "This is required!",
                                  },
                                ]}
                                required={false}
                              >
                                <TimePicker
                                  format="HH:mm"
                                  minuteStep={15}
                                  id={["schedules", name, "opening_time"].join(
                                    "-"
                                  )}
                                />
                              </Form.Item>
                              <Form.Item
                                label="Closing Time"
                                name={[name, "closing_time"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "This is required!",
                                  },
                                ]}
                                required={false}
                              >
                                <TimePicker
                                  format="HH:mm"
                                  minuteStep={15}
                                  id={["schedules", name, "closing_time"].join(
                                    "-"
                                  )}
                                />
                              </Form.Item>
                            </div>
                          </AnimateContainer>
                        );
                      })}
                      <div className="border border-gray-300 p-4 pt-8 rounded-md relative">
                        <div className="blur-sm grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <Form.Item
                            label="Days"
                            required={false}
                            {...rest}
                            className="col-span-3 lg:col-span-1"
                          >
                            <Select placeholder="Days">
                              {days.map((day, index) => {
                                return (
                                  <Select.Option value={day} key={index}>
                                    {day}
                                  </Select.Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            label="Opening Time"
                            required={false}
                            className="col-span-3 lg:col-span-1"
                          >
                            <TimePicker format="HH:mm" minuteStep={15} />
                          </Form.Item>
                          <Form.Item label="Closing Time" required={false}>
                            <TimePicker
                              format="HH:mm"
                              minuteStep={15}
                              className="col-span-3 lg:col-span-1"
                            />
                          </Form.Item>
                        </div>
                        <div
                          className="absolute top-0 left-0 h-full w-full flex justify-center items-center cursor-pointer"
                          onClick={() => add()}
                        >
                          <IoMdAddCircle className="text-7xl text-primary" />
                        </div>
                      </div>
                    </>
                  );
                }}
              </Form.List>
            </div>
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
