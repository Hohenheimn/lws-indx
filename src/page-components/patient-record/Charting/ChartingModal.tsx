import React, { useEffect, useState } from "react";
import { Checkbox, DatePicker, Form, notification } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { motion } from "framer-motion";
import moment from "moment";
import Image from "next/image";
import { scroller } from "react-scroll";
import Annotate from "@components/Annotate";
import { Button } from "@components/Button";
import { InfiniteSelect } from "@components/InfiniteSelect";
import Input from "@components/Input";
import Modal from "@components/Modal";
import { Select } from "@components/Select";
import { fadeIn } from "@src/components/animation/animation";
import DeleteButton from "@src/components/DeleteButton";
import { Radio } from "@src/components/Radio";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData, postData } from "@utilities/api";

import { Context } from "@utilities/context/Provider";
import { getAge } from "@utilities/helpers";

import AnnotationModal from "./AnnotationModal";
import { Teeth } from "./Teeth";

export default function ChartingModal({
  show,
  onClose,
  form,
  patientRecord,
  defaultAnnotation,
  pageType,
  ...rest
}: any) {
  const age = getAge(patientRecord.birthdate);

  let id = form.getFieldValue("_id");

  const queryClient = useQueryClient();

  const chart_type = Form.useWatch("chart_type", form);

  const { setIsAppLoading } = React.useContext(Context);

  const [showAnnotationModal, setShowAnnotationModal] = React.useState(false);

  const ChartView: string = Form.useWatch("chart_view", form);

  const [TeethUpperLeft, setTeethUpperLeft] = useState(
    Teeth(age, ChartView).UpperLeft
  );

  const [TeethUpperRight, setTeethUpperRight] = useState(
    Teeth(age, ChartView).UpperRight
  );

  const [TeethLowerLeft, setTeethLowerLeft] = useState(
    Teeth(age, ChartView).LowerLeft
  );

  const [TeethLowerRight, setTeethLowerRight] = useState(
    Teeth(age, ChartView).LowerRight
  );

  const [SelectedAnnotate, setSelectedAnnotate] = useState<any>({
    annotations: [],
    tooth_position: "",
    tooth_no: 1,
  });

  const resetToothNumber = () => {
    setTeethLowerLeft(Teeth(age, ChartView).LowerLeft);
    setTeethLowerRight(Teeth(age, ChartView).LowerRight);
    setTeethUpperLeft(Teeth(age, ChartView).UpperLeft);
    setTeethUpperRight(Teeth(age, ChartView).UpperRight);
  };

  const [procedures, setProcedure] = useState<any>([]);

  useEffect(() => {
    resetToothNumber();
  }, [ChartView]);

  useEffect(() => {
    const upper_left = TeethUpperLeft.filter(
      (itemFilter) => itemFilter.annotations.length > 0
    );
    const upper_right = TeethUpperRight.filter(
      (itemFilter) => itemFilter.annotations.length > 0
    );
    const lower_left = TeethLowerLeft.filter(
      (itemFilter) => itemFilter.annotations.length > 0
    );
    const lower_right = TeethLowerRight.filter(
      (itemFilter) => itemFilter.annotations.length > 0
    );
    const procedures = [
      ...upper_left,
      ...upper_right,
      ...lower_right,
      ...lower_left,
    ];
    setProcedure(procedures);
  }, [TeethUpperLeft, TeethUpperRight, TeethLowerLeft, TeethLowerRight]);

  useEffect(() => {
    let UpperLeft: any[] = [];
    let UpperRight: any[] = [];
    let LowerLeft: any[] = [];
    let LowerRight: any[] = [];
    defaultAnnotation.map((rowPosition: any) => {
      if (rowPosition.tooth_position === "upper_left") {
        const getFromFunc = AnnotationGetValues(rowPosition, TeethUpperLeft);
        UpperLeft = [...UpperLeft, getFromFunc];
      }

      if (rowPosition.tooth_position === "upper_right") {
        const getFromFunc = AnnotationGetValues(rowPosition, TeethUpperRight);
        UpperRight = [...UpperRight, getFromFunc];
      }

      if (rowPosition.tooth_position === "lower_left") {
        const getFromFunc = AnnotationGetValues(rowPosition, TeethLowerLeft);
        LowerLeft = [...LowerLeft, getFromFunc];
      }

      if (rowPosition.tooth_position === "lower_right") {
        const getFromFunc = AnnotationGetValues(rowPosition, TeethLowerRight);
        LowerRight = [...LowerRight, getFromFunc];
      }
    });
    ProcedureSetDefaultValue(UpperLeft, setTeethUpperLeft, TeethUpperLeft);
    ProcedureSetDefaultValue(UpperRight, setTeethUpperRight, TeethUpperRight);
    ProcedureSetDefaultValue(LowerLeft, setTeethLowerLeft, TeethLowerLeft);
    ProcedureSetDefaultValue(LowerRight, setTeethLowerRight, TeethLowerRight);
  }, [defaultAnnotation]);

  const AnnotationGetValues = (rowPosition: any, arrayToLoop: any) => {
    let arrayWithValues: any[] = [];
    arrayToLoop.map((rowNumber: any, index: number) => {
      if (rowPosition.tooth_no - 1 === index) {
        arrayWithValues = rowPosition;
        return;
      }
    });
    return arrayWithValues;
  };

  const ProcedureSetDefaultValue = (
    arrayValues: any[],
    setArrayValues: Function,
    teeth: any
  ) => {
    const Filter = teeth.filter(
      (filterItem: any) =>
        !arrayValues.some(
          (someItem) => someItem.tooth_no === filterItem.tooth_no
        )
    );
    // const sorted = [...Filter, ...arrayValues].sort(
    //   (a, b) => a.tooth_no - b.tooth_no
    // );
    setArrayValues([...Filter, ...arrayValues]);
  };

  React.useEffect(() => {
    form.setFieldsValue({
      ...form,
      created_at: moment(form?.getFieldValue("created_at")).isValid()
        ? moment(form?.getFieldValue("created_at"))
        : undefined,
    });
  }, [show]);

  const UpdateTeeth = (
    array: any,
    tooth_no: number,
    annotations: any,
    position: string
  ) => {
    const UpdatedTooth = array.map((itemMap: any) => {
      if (itemMap.tooth_no === tooth_no) {
        return {
          tooth_position: position,
          tooth_no: tooth_no,
          annotations: annotations,
        };
      }
      return itemMap;
    });
    return UpdatedTooth;
  };

  const UpdateToothsHandler = (
    tooth_no: number,
    tooth_position: string,
    annotations: any
  ) => {
    if (tooth_position === "upper_left") {
      const UpdatedTooth = UpdateTeeth(
        TeethUpperLeft,
        tooth_no,
        annotations,
        "upper_left"
      );
      setTeethUpperLeft(UpdatedTooth);
    }
    if (tooth_position === "upper_right") {
      const UpdatedTooth = UpdateTeeth(
        TeethUpperRight,
        tooth_no,
        annotations,
        "upper_right"
      );
      setTeethUpperRight(UpdatedTooth);
    }
    if (tooth_position === "lower_left") {
      const UpdatedTooth = UpdateTeeth(
        TeethLowerLeft,
        tooth_no,
        annotations,
        "lower_left"
      );
      setTeethLowerLeft(UpdatedTooth);
    }
    if (tooth_position === "lower_right") {
      const UpdatedTooth = UpdateTeeth(
        TeethLowerRight,
        tooth_no,
        annotations,
        "lower_right"
      );
      setTeethLowerRight(UpdatedTooth);
    }
  };

  const { mutate: addChart } = useMutation(
    (payload: any) => {
      return postData({
        url: `/api/patient/charting/${patientRecord?._id}`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Adding New Chart Success",
          description: `Adding New Chart Success`,
        });
        form.resetFields();
        resetToothNumber();
        setMissingToothNo([]);
        queryClient.invalidateQueries({
          queryKey: ["treatment-record"],
        });
        onClose();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: ["charting-list"],
        });
        const previousValues = queryClient.getQueryData(["charting-list"]);
        queryClient.setQueryData(["charting-list"], (oldData: any) =>
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
        queryClient.setQueryData(["charting-list"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["charting-list"] });
      },
    }
  );

  const { mutate: editChart } = useMutation(
    (payload) => {
      let id = form.getFieldValue("_id");
      return postData({
        url: `/api/patient/charting/update/${id}?_method=PUT`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Chart Updated!",
          description: `Chart Updated!`,
        });
        form.resetFields();
        resetToothNumber();
        queryClient.invalidateQueries({
          queryKey: ["treatment-record"],
        });
        setMissingToothNo([]);
        onClose();
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: ["charting-list"],
        });
        const previousValues = queryClient.getQueryData(["charting-list"]);
        queryClient.setQueryData(["charting-list"], (oldData: any) =>
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
        queryClient.setQueryData(["charting-list"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["charting-list"] });
      },
    }
  );

  const { mutate: deleteCharting }: any = useMutation(
    () =>
      deleteData({
        url: `/api/patient/charting/${id}`,
      }),
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Chart Deleted",
          description: "Chart has been deleted",
        });
        onClose();
        setMissingToothNo([]);
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: ["charting-list"],
        });
        const previousValues = queryClient.getQueryData(["charting-list"]);
        queryClient.setQueryData(["charting-list"], (oldData: any) =>
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
        queryClient.setQueryData(["charting-list"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["charting-list"] });
      },
    }
  );

  const [missingToothNo, setMissingToothNo] = useState<number[]>([]);

  const [missingToothOpt, setMIssingToothOpt] = useState(false);

  const addMissingToothHandler = (toothNo: number) => {
    if (missingToothNo.includes(toothNo)) {
      const filter = missingToothNo.filter(
        (filterItem) => filterItem !== toothNo
      );
      setMissingToothNo(filter);
    } else {
      setMissingToothNo([...missingToothNo, toothNo]);
    }
  };

  return (
    <>
      <Modal
        show={show}
        onClose={() => {}}
        // onClose={onClose}
        {...rest}
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="font-bold text-3xl">
              {id ? "Update" : "New"} Chart
            </div>
          </div>
          {id && (
            <DeleteButton
              label="Delete Chart"
              deleteHandler={() => deleteCharting()}
            />
          )}
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              let id = form.getFieldValue("_id");
              values.legend_periodical_screening = JSON.stringify(
                values.legend_periodical_screening
              );
              values.legend_occlusions = JSON.stringify(
                values.legend_occlusions
              );
              values.legend_appliances = JSON.stringify(
                values.legend_appliances
              );
              values.legend_tmds = JSON.stringify(values.legend_tmds);

              values.procedures = JSON.stringify(procedures);

              values.legend_periodical_screening_others =
                values.legend_periodical_screening_others === null
                  ? ""
                  : values.legend_periodical_screening_others;

              values.legend_occlusions_others =
                values.legend_occlusions_others === null
                  ? ""
                  : values.legend_occlusions_others;

              values.legend_appliances_others =
                values.legend_appliances_others === null
                  ? ""
                  : values.legend_appliances_others;

              values.legend_tmds_others =
                values.legend_tmds_others === null
                  ? ""
                  : values.legend_tmds_others;

              values.remarks = values.remarks === null ? "" : values.remarks;

              if (!id) {
                addChart(values);
              } else {
                values.id = id;
                editChart(values);
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
                label="Chart Name"
                name="chart_name"
                rules={[
                  {
                    required: true,
                    message: "This is required!",
                  },
                ]}
                required={true}
              >
                <Input
                  id="chart_name"
                  disabled={pageType === "view" && id}
                  placeholder="Chart Name"
                />
              </Form.Item>
              <Form.Item label="Date Created" name="created_at" required={true}>
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
                rules={[
                  {
                    required: true,
                    message: "This is required!",
                  },
                ]}
                required={true}
                initialValue={""}
              >
                <Select
                  placeholder="Chart view"
                  id="chart_type"
                  disabled={procedures.length > 0}
                >
                  <Select.Option value={"Basic"}>Basic</Select.Option>

                  <Select.Option value={"Initial"}>Initial</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Chart View"
                name="chart_view"
                rules={[
                  {
                    required: true,
                    message: "Chart view is required",
                  },
                ]}
                required={true}
                initialValue={""}
              >
                <Select
                  placeholder="Chart view"
                  id="chart_view"
                  disabled={procedures.length > 0}
                >
                  <Select.Option value={"Standard"}>Standard</Select.Option>

                  <Select.Option value={"Periodontal"}>
                    Periodontal
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Branch"
                name="branch_id"
                rules={[
                  {
                    required: true,
                    message: "This is required",
                  },
                ]}
                required={true}
              >
                <InfiniteSelect
                  placeholder="Select Clinic"
                  id="branch_id"
                  api={`${process.env.REACT_APP_API_BASE_URL}/api/branch?limit=3&for_dropdown=true&page=1`}
                  queryKey={["branch"]}
                  displayValueKey="name"
                  disabled={pageType === "view" && id}
                  returnValueKey="_id"
                />
              </Form.Item>
              <Form.Item
                label="Doctor"
                name="doctor_id"
                rules={[
                  {
                    required: true,
                    message: "This is required",
                  },
                ]}
                required={true}
              >
                <InfiniteSelect
                  placeholder="Select Denstist"
                  id="doctor_id"
                  api={`${process.env.REACT_APP_API_BASE_URL}/api/account?limit=3&for_dropdown=true&page=1`}
                  queryKey={["doctor"]}
                  disabled={pageType === "view" && id}
                  displayValueKey="name"
                  returnValueKey="_id"
                />
              </Form.Item>
            </div>

            <div
              onClick={() => setMIssingToothOpt(!missingToothOpt)}
              className={` ${
                missingToothOpt
                  ? "bg-primary-500 rounded-md hover:bg-primary-600 text-white"
                  : " bg-gray-300 rounded-md hover:bg-gray-400"
              } inline-block  px-5 py-2 duration-300 cursor-pointer`}
            >
              Missing Tooth
            </div>
            <hr className="border-t-2" />

            <div
              className={`space-y-8 ${(chart_type === "" || ChartView === "") &&
                "blur-sm pointer-events-none"}`}
            >
              <div className="grid grid-cols-2 gap-12">
                <div className="flex justify-evenly lg:gap-4 flex-wrap lg:flex-nowrap">
                  {TeethUpperLeft.map((item: any, index: number) => {
                    return (
                      <div
                        onClick={() => {
                          if (missingToothOpt) {
                            addMissingToothHandler(item.tooth_no);
                            return;
                          }
                          if (missingToothNo.includes(item.tooth_no)) return;
                          setShowAnnotationModal(true);
                          setSelectedAnnotate(item);
                        }}
                        className={` ${!missingToothOpt &&
                          !missingToothNo.includes(item.tooth_no) &&
                          "md:hover:scale-110"} flex flex-col justify-between duration-300 relative space-y-2 transition cursor-pointer z-10 p-5 lg:p-0 w-[48%] lg:w-auto`}
                        key={index}
                      >
                        {missingToothNo.includes(item.tooth_no) && (
                          <motion.div
                            variants={fadeIn}
                            initial="initial"
                            animate="animate"
                            className=" absolute top-0 left-0 w-full h-full bg-[#8585856b] z-10"
                          ></motion.div>
                        )}
                        <h5 className="text-center">{item.tooth_no}</h5>

                        {ChartView === "Periodontal" && (
                          <div className="w-full">
                            <Annotate
                              pageType={pageType}
                              disabled={true}
                              image={`/images/teeth_periodontal/${`${item.tooth_no}`}.png`}
                              defaultValue={item}
                            />
                          </div>
                        )}
                        {(ChartView === "Standard" ||
                          ChartView === undefined ||
                          ChartView === "") && (
                          <div className="w-full">
                            <Annotate
                              pageType={pageType}
                              disabled={true}
                              image={`/images/tooth-periodontal.png`}
                              defaultValue={item}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-evenly lg:gap-4 flex-wrap lg:flex-nowrap">
                  {TeethUpperRight.map((item: any, index: number) => {
                    return (
                      <div
                        onClick={() => {
                          setShowAnnotationModal(true);
                          setSelectedAnnotate(item);
                        }}
                        className="space-y-2 flex flex-col justify-between md:hover:scale-110 transition cursor-pointer z-10 p-5 lg:p-0 w-[48%] lg:w-auto"
                        key={index}
                      >
                        <h5 className="text-center">{item.tooth_no}</h5>
                        {ChartView === "Periodontal" && (
                          <div className="w-full">
                            <Annotate
                              pageType={pageType}
                              disabled={true}
                              image={`/images/teeth_periodontal/${`${item.tooth_no}`}.png`}
                              defaultValue={item}
                            />
                          </div>
                        )}

                        {(ChartView === "Standard" ||
                          ChartView === undefined ||
                          ChartView === "") && (
                          <div className="w-full">
                            <Annotate
                              pageType={pageType}
                              disabled={true}
                              image={`/images/tooth-periodontal.png`}
                              defaultValue={item}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <hr className="border-t-2 border-black" />
              <div className="grid grid-cols-2 gap-12">
                <div className="flex justify-evenly lg:gap-4 flex-wrap lg:flex-nowrap">
                  {TeethLowerLeft.map((item: any, index: number) => {
                    return (
                      <div
                        onClick={() => {
                          setShowAnnotationModal(true);
                          setSelectedAnnotate(item);
                        }}
                        className="space-y-2 md:hover:scale-110 transition cursor-pointer z-10 p-5 lg:p-0 w-[48%] lg:w-auto"
                        key={index}
                      >
                        <h5 className="text-center">{item.tooth_no}</h5>
                        {ChartView === "Periodontal" && (
                          <div className="w-full">
                            <Annotate
                              pageType={pageType}
                              disabled={true}
                              image={`/images/teeth_periodontal/${`${item.tooth_no}`}.png`}
                              defaultValue={item}
                            />
                          </div>
                        )}

                        {(ChartView === "Standard" ||
                          ChartView === undefined ||
                          ChartView === "") && (
                          <div className="w-full">
                            <Annotate
                              pageType={pageType}
                              disabled={true}
                              image={`/images/tooth-periodontal.png`}
                              defaultValue={item}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-evenly lg:gap-4 flex-wrap lg:flex-nowrap">
                  {TeethLowerRight.map((item: any, index: number) => {
                    return (
                      <div
                        onClick={() => {
                          setShowAnnotationModal(true);
                          setSelectedAnnotate(item);
                        }}
                        className="space-y-2 md:hover:scale-110 transition cursor-pointer z-10 p-5 lg:p-0 w-[48%] lg:w-auto"
                        key={index}
                      >
                        <h5 className="text-center">{item.tooth_no}</h5>
                        {ChartView === "Periodontal" && (
                          <div className="w-full">
                            <Annotate
                              pageType={pageType}
                              disabled={true}
                              image={`/images/teeth_periodontal/${`${item.tooth_no}`}.png`}
                              defaultValue={item}
                            />
                          </div>
                        )}

                        {(ChartView === "Standard" ||
                          ChartView === undefined ||
                          ChartView === "") && (
                          <div className="w-full">
                            <Annotate
                              pageType={pageType}
                              disabled={true}
                              image={`/images/tooth-periodontal.png`}
                              defaultValue={item}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <hr className="border-t-2" />
            <div className="flex items-center justify-between">
              <div className=" font-semibold text-2xl">Legend</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-10">
              <div>
                <h4 className=" font-semibold text-lg">Periodical Screening</h4>
                <Form.Item
                  name="legend_periodical_screening"
                  required={true}
                  className="text-base"
                >
                  <Checkbox.Group
                    disabled={pageType === "view" && id}
                    className="grid grid-cols-1 gap-2 justify-center py-4 text-lg"
                  >
                    <Checkbox value="Gingivits">Gingivits</Checkbox>
                    <Checkbox value="Early Periodontics">
                      Early Periodontics
                    </Checkbox>
                    <Checkbox value="Moderate Periodontics">
                      Moderate Periodontics
                    </Checkbox>
                    <Checkbox value="Advance Periodontics">
                      Advance Periodontics
                    </Checkbox>
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item
                  label=""
                  name="legend_periodical_screening_others"
                  required={true}
                  initialValue={""}
                >
                  <Input
                    id="legend_periodical_screening_others"
                    placeholder="others"
                    disabled={pageType === "view" && id}
                  />
                </Form.Item>
              </div>
              <div>
                <h4 className=" font-semibold text-lg">Occlusions</h4>
                <Form.Item
                  name="legend_occlusions"
                  required={true}
                  className="text-base"
                >
                  <Checkbox.Group
                    disabled={pageType === "view" && id}
                    className="grid grid-cols-1 gap-2 justify-center py-4 text-lg"
                  >
                    <Checkbox value="Class Molar">Class Molar</Checkbox>
                    <Checkbox value="Overjet">Overjet</Checkbox>
                    <Checkbox value="Overbite">Overbite</Checkbox>
                    <Checkbox value="Midline Deviation">
                      Midline Deviation
                    </Checkbox>
                    <Checkbox value="Crossbite">Crossbite</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item
                  label=""
                  name="legend_occlusions_others"
                  required={true}
                  initialValue={""}
                >
                  <Input
                    id="legend_occlusions_others"
                    disabled={pageType === "view" && id}
                    placeholder="others"
                  />
                </Form.Item>
              </div>
              <div>
                <h4 className=" font-semibold text-lg">Appliances</h4>
                <Form.Item
                  name="legend_appliances"
                  required={true}
                  className="text-base"
                >
                  <Checkbox.Group
                    disabled={pageType === "view" && id}
                    className="grid grid-cols-1 gap-2 justify-center py-4 text-lg"
                  >
                    <Checkbox value="Orthodontic">Orthodontic</Checkbox>
                    <Checkbox value="Stayplate">Stayplate</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item
                  label=""
                  name="legend_appliances_others"
                  required={true}
                  initialValue={""}
                >
                  <Input
                    id="legend_appliances_others"
                    disabled={pageType === "view" && id}
                    placeholder="others"
                  />
                </Form.Item>
              </div>
              <div>
                <h4 className=" font-semibold text-lg">TMDs</h4>
                <Form.Item
                  name="legend_tmds"
                  required={true}
                  className="text-base"
                >
                  <Checkbox.Group
                    disabled={pageType === "view" && id}
                    className="grid grid-cols-1 gap-2 justify-center py-4 text-lg"
                  >
                    <Checkbox value="Clenching">Clenching</Checkbox>
                    <Checkbox value="Clicking">Clicking</Checkbox>
                    <Checkbox value="Trismus">Trismus</Checkbox>
                    <Checkbox value="Muscle Spasm">Muscle Spasm</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item
                  label=""
                  name="legend_tmds_others"
                  required={true}
                  initialValue={""}
                >
                  <Input
                    id="legend_tmds_others"
                    disabled={pageType === "view" && id}
                    placeholder="others"
                  />
                </Form.Item>
              </div>
            </div>

            <div className="grid grid-cols-1">
              <Form.Item label="Remark" name="remarks" initialValue={""}>
                <TextArea
                  id="remarks"
                  placeholder="Remarks"
                  disabled={pageType === "view" && id}
                />
              </Form.Item>
            </div>

            {pageType === "view" && id ? (
              <div className="flex justify-end items-center gap-4">
                <Button
                  appearance="link"
                  className="p-4 bg-transparent border-none text-casper-500 font-semibold"
                  onClick={() => {
                    resetToothNumber();
                    onClose();
                    setMissingToothNo([]);
                  }}
                >
                  Close
                </Button>
              </div>
            ) : (
              <div className="flex justify-end items-center gap-4">
                <Button
                  appearance="link"
                  className="p-4 bg-transparent border-none text-casper-500 font-semibold"
                  onClick={() => {
                    resetToothNumber();
                    onClose();
                    setMissingToothNo([]);
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
            )}
          </Form>
        </div>
      </Modal>
      <AnnotationModal
        show={showAnnotationModal}
        onClose={() => {
          setShowAnnotationModal(false);
          setMissingToothNo([]);
        }}
        ChartView={ChartView}
        className="w-full"
        SelectedAnnotate={SelectedAnnotate}
        UpdateToothsHandler={UpdateToothsHandler}
        id="annotation-modal"
        pageType={pageType}
        form_id={id}
      />
    </>
  );
}
