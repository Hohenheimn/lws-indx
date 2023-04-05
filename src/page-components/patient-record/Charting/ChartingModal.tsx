import React from "react";
import { DatePicker, Form, notification } from "antd";
import Input from "../../../components/Input";
import { Button } from "../../../components/Button";
import Modal from "../../../components/Modal";
import { NumericFormat } from "react-number-format";
import { scroller } from "react-scroll";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "../../../../utils/api";
import { Context } from "../../../../utils/context/Provider";
import TextArea from "antd/lib/input/TextArea";
import { IoMdAddCircle } from "react-icons/io";
import { AiFillMinusCircle } from "react-icons/ai";
import { AnimateContainer } from "../../../components/animation";
import { fadeIn } from "../../../components/animation/animation";
import { InfiniteSelect } from "../../../components/InfiniteSelect";
import { getInitialValue } from "../../../../utils/helpers";
import moment from "moment";
import Annotate from "../../../components/Annotate";
import AnnotationModal from "./AnnotationModal";

export default function ChartingModal({
  show,
  onClose,
  form,
  patientRecord,
  ...rest
}: any) {
  const queryClient = useQueryClient();
  const { setIsAppLoading } = React.useContext(Context);

  const { mutate: addPrescription } = useMutation(
    (payload: any) => {
      return postData({
        url: `/api/patient/prescription/${patientRecord?._id}`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Adding New Prescription Success",
          description: `Adding New Prescription Success`,
        });
        form.resetFields();
        onClose();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["prescription"] });
        const previousValues = queryClient.getQueryData(["prescription"]);
        queryClient.setQueryData(["prescription"], (oldData: any) =>
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
        queryClient.setQueryData(["prescription"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["prescription"] });
      },
    }
  );

  const { mutate: editPrescription } = useMutation(
    (payload: any) => {
      return postData({
        url: `/api/patient/prescription/${payload.id}?_method=PUT`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Prescription Updated!",
          description: `Prescription Updated!`,
        });
        form.resetFields();
        onClose();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["prescription"] });
        const previousValues = queryClient.getQueryData(["prescription"]);
        queryClient.setQueryData(["prescription"], (oldData: any) =>
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
        queryClient.setQueryData(["prescription"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["prescription"] });
      },
    }
  );

  return (
    <>
      <Modal show={show} onClose={onClose} {...rest}>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="font-bold text-3xl">New Chart</div>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              let id = form.getFieldValue("_id");
              values.medicines.map((row: any, index: number) => {
                values.medicines[index].medicine_id = row.medicine_id._id;
              });

              values.medicines = JSON.stringify(values.medicines);

              if (!id) {
                addPrescription(values);
              } else {
                values.id = id;
                editPrescription(values);
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Form.Item
                label="Prescription Name"
                name="name"
                rules={[{ required: true, message: "This is required!" }]}
                required={false}
              >
                <Input id="name" placeholder="Prescription Name" />
              </Form.Item>
              <Form.Item
                label="Date Created"
                name="created_at"
                required={false}
                initialValue={moment()}
              >
                <DatePicker
                  getPopupContainer={(triggerNode: any) => {
                    return triggerNode.parentNode;
                  }}
                  placeholder="Date Created"
                  id="created_at"
                  format="MMMM DD, YYYY"
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label="Chart Type"
                name="chart_type"
                required={false}
                initialValue={moment()}
              >
                <DatePicker
                  getPopupContainer={(triggerNode: any) => {
                    return triggerNode.parentNode;
                  }}
                  placeholder="Chart Type"
                  id="chart_type"
                  format="MMMM DD, YYYY"
                />
              </Form.Item>
              <Form.Item
                label="Chart View"
                name="chart_view"
                rules={[{ required: true, message: "This is required!" }]}
                required={false}
              >
                <Input id="chart_view" placeholder="Chart View" />
              </Form.Item>
            </div>
            <hr className="border-t-2" />
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-12">
                <div className="grid grid-cols-1 lg:grid-cols-8 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((row, index) => {
                    return (
                      <div
                        className="space-y-2 hover:scale-110 transition cursor-pointer z-10"
                        key={index}
                      >
                        <h5 className="text-center">{row}</h5>
                        <div className="h-14 w-full">
                          <Annotate
                            // disabled={true}
                            image={`/images/tooth-standard.png`}
                          />
                        </div>
                        <div className="h-14 w-full">
                          <Annotate
                            // disabled={true}
                            image={`/images/tooth-periodontal.png`}
                          />
                        </div>
                        {/* <div className="flex justify-center items-center">
                        {row}
                      </div> */}
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-8 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((row, index) => {
                    return (
                      <div
                        className="space-y-2 hover:scale-110 hover:z-10 transition cursor-pointer"
                        key={index}
                      >
                        <h5 className="text-center">{row}</h5>
                        <div className="h-14 w-full">
                          <Annotate
                            // disabled={true}
                            image={`/images/tooth-standard.png`}
                          />
                        </div>
                        <div className="h-14 w-full">
                          <Annotate
                            // disabled={true}
                            image={`/images/tooth-periodontal.png`}
                          />
                        </div>
                        {/* <div className="flex justify-center items-center">
                        {row}
                      </div> */}
                      </div>
                    );
                  })}
                </div>
              </div>
              <hr className="border-t-2 border-black" />
              <div className="grid grid-cols-2 gap-12">
                <div className="grid grid-cols-1 lg:grid-cols-8 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((row, index) => {
                    return (
                      <div
                        className="space-y-2 hover:scale-110 focus:z-[1000000000000000000000] transition cursor-pointer"
                        key={index}
                      >
                        <div className="h-14 w-full">
                          <Annotate
                            // disabled={true}
                            image={`/images/tooth-standard.png`}
                          />
                        </div>
                        <div className="h-14 w-full">
                          <Annotate
                            // disabled={true}
                            image={`/images/tooth-periodontal.png`}
                          />
                        </div>
                        {/* <div className="flex justify-center items-center">
                        {row}
                      </div> */}
                        <h5 className="text-center">{row}</h5>
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-8 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((row, index) => {
                    return (
                      <div
                        className="space-y-2 hover:scale-110 transition cursor-pointer z-10"
                        key={index}
                      >
                        <div className="h-14 w-full">
                          <Annotate
                            // disabled={true}
                            image={`/images/tooth-standard.png`}
                            defaultValue={[
                              {
                                key: 1,
                                data: {
                                  color: "blue",
                                  description: "Description 2",
                                  title: "Procedure 2",
                                  icon: <div>A</div>,
                                  id: 1,
                                },
                                geometry: {
                                  height: 0,
                                  type: "POINT",
                                  width: 0,
                                  x: 80.03328055283504,
                                  y: 67.72089306950318,
                                },
                              },
                            ]}
                          />
                        </div>
                        <div className="h-14 w-full">
                          <Annotate
                            // disabled={true}
                            image={`/images/tooth-periodontal.png`}
                          />
                        </div>
                        <h5 className="text-center">{row}</h5>
                        {/* <div className="flex justify-center items-center">
                        {row}
                      </div> */}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <hr className="border-t-2" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Form.Item
                label="Prescription Name"
                name="name"
                rules={[{ required: true, message: "This is required!" }]}
                required={false}
              >
                <Input id="name" placeholder="Prescription Name" />
              </Form.Item>
              <Form.Item
                label="Date Created"
                name="created_at"
                required={false}
                initialValue={moment()}
              >
                <DatePicker
                  getPopupContainer={(triggerNode: any) => {
                    return triggerNode.parentNode;
                  }}
                  placeholder="Date Created"
                  id="created_at"
                  format="MMMM DD, YYYY"
                  disabled={true}
                />
              </Form.Item>
              <Form.Item
                label="Chart Type"
                name="chart_type"
                required={false}
                initialValue={moment()}
              >
                <DatePicker
                  getPopupContainer={(triggerNode: any) => {
                    return triggerNode.parentNode;
                  }}
                  placeholder="Chart Type"
                  id="chart_type"
                  format="MMMM DD, YYYY"
                />
              </Form.Item>
              <Form.Item
                label="Chart View"
                name="chart_view"
                rules={[{ required: true, message: "This is required!" }]}
                required={false}
              >
                <Input id="chart_view" placeholder="Chart View" />
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
      <AnnotationModal
        show={true}
        onClose={() => {
          console.log("zxcv");
          // setIsChartingModalOpen(false);
          // ChartingForm.resetFields();
        }}
        className="w-full"
        id="annotation-modal"
        // patientRecord={patientRecord}
        // form={ChartingForm}
      />
    </>
  );
}
