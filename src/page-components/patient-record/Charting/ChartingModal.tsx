import React, { useEffect, useState } from "react";
import { Checkbox, DatePicker, Form, notification } from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import { scroller } from "react-scroll";
import Annotate from "@components/Annotate";
import { Button } from "@components/Button";
import { InfiniteSelect } from "@components/InfiniteSelect";
import Input from "@components/Input";
import Modal from "@components/Modal";
import { Select } from "@components/Select";
import DeleteButton from "@src/components/DeleteButton";
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
  ...rest
}: any) {
  const age = getAge(patientRecord.birthdate);

  let id = form.getFieldValue("_id");

  const queryClient = useQueryClient();

  const chart_type = Form.useWatch("chart_type", form);

  const chart_view = Form.useWatch("chart_view", form);

  const { setIsAppLoading } = React.useContext(Context);

  const [showAnnotationModal, setShowAnnotationModal] = React.useState(false);

  const [TeethUpperLeft, setTeethUpperLeft] = useState(Teeth.UpperLeft);

  const [TeethUpperRight, setTeethUpperRight] = useState(Teeth.UpperRight);

  const [TeethLowerLeft, setTeethLowerLeft] = useState(Teeth.LowerLeft);

  const [TeethLowerRight, setTeethLowerRight] = useState(Teeth.LowerRight);

  const [SelectedAnnotate, setSelectedAnnotate] = useState<any>({
    annotations: [],
    tooth_position: "",
    tooth_no: 1,
  });

  const [procedures, setProcedure] = useState<any>([]);

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
    const sorted = [...Filter, ...arrayValues].sort(
      (a, b) => a.tooth_no - b.tooth_no
    );
    setArrayValues(sorted);
  };

  const ChartView = Form.useWatch("chart_view", form);

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
        setTeethLowerLeft(Teeth.LowerLeft);
        setTeethLowerRight(Teeth.LowerRight);
        setTeethUpperLeft(Teeth.UpperLeft);
        setTeethUpperRight(Teeth.UpperRight);
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
        setTeethLowerLeft(Teeth.LowerLeft);
        setTeethLowerRight(Teeth.LowerRight);
        setTeethUpperLeft(Teeth.UpperLeft);
        setTeethUpperRight(Teeth.UpperRight);
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
                required={false}
              >
                <Input id="chart_name" placeholder="Chart Name" />
              </Form.Item>

              <Form.Item
                label="Date Created"
                name="created_at"
                required={false}
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
                rules={[
                  {
                    required: true,
                    message: "This is required!",
                  },
                ]}
                required={false}
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
                required={false}
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
                required={false}
              >
                <InfiniteSelect
                  placeholder="Select Clinic"
                  id="branch_id"
                  api={`${process.env.REACT_APP_API_BASE_URL}/api/branch?limit=3&for_dropdown=true&page=1`}
                  queryKey={["branch"]}
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
                    message: "This is required",
                  },
                ]}
                required={false}
              >
                <InfiniteSelect
                  placeholder="Select Denstist"
                  id="doctor_id"
                  api={`${process.env.REACT_APP_API_BASE_URL}/api/account?limit=3&for_dropdown=true&page=1`}
                  queryKey={["doctor"]}
                  displayValueKey="name"
                  returnValueKey="_id"
                />
              </Form.Item>
            </div>
            <hr className="border-t-2" />

            <div
              className={`space-y-8 ${(chart_type === "" ||
                chart_view === "") &&
                "blur-sm pointer-events-none"}`}
            >
              <div className="grid grid-cols-2 gap-12">
                <div className="grid grid-cols-1 lg:grid-cols-8 gap-4">
                  {TeethUpperLeft.map((item: any, index: number) => {
                    return (
                      <div
                        onClick={() => {
                          setShowAnnotationModal(true);
                          setSelectedAnnotate(item);
                        }}
                        className="space-y-2 md:hover:scale-110 transition cursor-pointer z-10"
                        key={index}
                      >
                        <h5 className="text-center">{item.tooth_no}</h5>

                        {(ChartView === "Periodontal" ||
                          ChartView === undefined ||
                          ChartView === "") && (
                          <div className="w-full">
                            <Annotate
                              disabled={true}
                              image={`/images/tooth-standard.png`}
                              defaultValue={item}
                            />
                          </div>
                        )}

                        {(ChartView === "Standard" ||
                          ChartView === undefined ||
                          ChartView === "") && (
                          <div className="w-full">
                            <Annotate
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
                <div className="grid grid-cols-1 lg:grid-cols-8 gap-4">
                  {TeethUpperRight.map((item: any, index: number) => {
                    return (
                      <div
                        onClick={() => {
                          setShowAnnotationModal(true);
                          setSelectedAnnotate(item);
                        }}
                        className="space-y-2 md:hover:scale-110 transition cursor-pointer z-10"
                        key={index}
                      >
                        <h5 className="text-center">{item.tooth_no}</h5>
                        {(ChartView === "Periodontal" ||
                          ChartView === undefined ||
                          ChartView === "") && (
                          <div className="w-full">
                            <Annotate
                              disabled={true}
                              image={`/images/tooth-standard.png`}
                              defaultValue={item}
                            />
                          </div>
                        )}

                        {(ChartView === "Standard" ||
                          ChartView === undefined ||
                          ChartView === "") && (
                          <div className="w-full">
                            <Annotate
                              disabled={true}
                              image={`/images/tooth-periodontal.png`}
                              defaultValue={item}
                            />
                          </div>
                        )}
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
                  {TeethLowerLeft.map((item: any, index: number) => {
                    return (
                      <div
                        onClick={() => {
                          setShowAnnotationModal(true);
                          setSelectedAnnotate(item);
                        }}
                        className="space-y-2 md:hover:scale-110 transition cursor-pointer z-10"
                        key={index}
                      >
                        <h5 className="text-center">{item.tooth_no}</h5>
                        {(ChartView === "Periodontal" ||
                          ChartView === undefined ||
                          ChartView === "") && (
                          <div className="w-full">
                            <Annotate
                              disabled={true}
                              image={`/images/tooth-standard.png`}
                              defaultValue={item}
                            />
                          </div>
                        )}

                        {(ChartView === "Standard" ||
                          ChartView === undefined ||
                          ChartView === "") && (
                          <div className="w-full">
                            <Annotate
                              disabled={true}
                              image={`/images/tooth-periodontal.png`}
                              defaultValue={item}
                            />
                          </div>
                        )}
                        {/* <div className="flex justify-center items-center">
                                                        {row}
                                                    </div> */}
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-8 gap-4">
                  {TeethLowerRight.map((item: any, index: number) => {
                    return (
                      <div
                        onClick={() => {
                          setShowAnnotationModal(true);
                          setSelectedAnnotate(item);
                        }}
                        className="space-y-2 md:hover:scale-110 transition cursor-pointer z-10"
                        key={index}
                      >
                        <h5 className="text-center">{item.tooth_no}</h5>
                        {(ChartView === "Periodontal" ||
                          ChartView === undefined ||
                          ChartView === "") && (
                          <div className="w-full">
                            <Annotate
                              disabled={true}
                              image={`/images/tooth-standard.png`}
                              defaultValue={item}
                            />
                          </div>
                        )}

                        {(ChartView === "Standard" ||
                          ChartView === undefined ||
                          ChartView === "") && (
                          <div className="w-full">
                            <Annotate
                              disabled={true}
                              image={`/images/tooth-periodontal.png`}
                              defaultValue={item}
                            />
                          </div>
                        )}
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
            <div className="flex items-center justify-between">
              <div className=" font-semibold text-2xl">Legend</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-10">
              <div>
                <h4 className=" font-semibold text-lg">Periodical Screening</h4>
                <Form.Item
                  name="legend_periodical_screening"
                  required={false}
                  className="text-base"
                >
                  <Checkbox.Group className="grid grid-cols-1 gap-2 justify-center py-4 text-lg">
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
                  required={false}
                  initialValue={""}
                >
                  <Input
                    id="legend_periodical_screening_others"
                    placeholder="others"
                  />
                </Form.Item>
              </div>
              <div>
                <h4 className=" font-semibold text-lg">Occlusions</h4>
                <Form.Item
                  name="legend_occlusions"
                  required={false}
                  className="text-base"
                >
                  <Checkbox.Group className="grid grid-cols-1 gap-2 justify-center py-4 text-lg">
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
                  required={false}
                  initialValue={""}
                >
                  <Input id="legend_occlusions_others" placeholder="others" />
                </Form.Item>
              </div>
              <div>
                <h4 className=" font-semibold text-lg">Appliances</h4>
                <Form.Item
                  name="legend_appliances"
                  required={false}
                  className="text-base"
                >
                  <Checkbox.Group className="grid grid-cols-1 gap-2 justify-center py-4 text-lg">
                    <Checkbox value="Orthodontic">Orthodontic</Checkbox>
                    <Checkbox value="Stayplate">Stayplate</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item
                  label=""
                  name="legend_appliances_others"
                  required={false}
                  initialValue={""}
                >
                  <Input id="legend_appliances_others" placeholder="others" />
                </Form.Item>
              </div>
              <div>
                <h4 className=" font-semibold text-lg">TMDs</h4>
                <Form.Item
                  name="legend_tmds"
                  required={false}
                  className="text-base"
                >
                  <Checkbox.Group className="grid grid-cols-1 gap-2 justify-center py-4 text-lg">
                    <Checkbox value="Clenching">Clenching</Checkbox>
                    <Checkbox value="Clicking">Clicking</Checkbox>
                    <Checkbox value="Trismus">Trismus</Checkbox>
                    <Checkbox value="Muscle Spasm">Muscle Spasm</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item
                  label=""
                  name="legend_tmds_others"
                  required={false}
                  initialValue={""}
                >
                  <Input id="legend_tmds_others" placeholder="others" />
                </Form.Item>
              </div>
            </div>

            <div className="grid grid-cols-1">
              <Form.Item
                label="Remark"
                name="remarks"
                required={false}
                initialValue={""}
              >
                <TextArea id="remarks" placeholder="Remarks" />
              </Form.Item>
            </div>

            <div className="flex justify-end items-center gap-4">
              <Button
                appearance="link"
                className="p-4 bg-transparent border-none text-casper-500 font-semibold"
                onClick={() => {
                  setTeethLowerLeft(Teeth.LowerLeft);
                  setTeethLowerRight(Teeth.LowerRight);
                  setTeethUpperLeft(Teeth.UpperLeft);
                  setTeethUpperRight(Teeth.UpperRight);

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
      </Modal>
      <AnnotationModal
        show={showAnnotationModal}
        onClose={() => {
          setShowAnnotationModal(false);
          // console.log("zxcv");
          // setIsChartingModalOpen(false);
          // ChartingForm.resetFields();
        }}
        ChartView={ChartView}
        className="w-full"
        SelectedAnnotate={SelectedAnnotate}
        UpdateToothsHandler={UpdateToothsHandler}
        id="annotation-modal"
        // patientRecord={patientRecord}
        // form={ChartingForm}
      />
    </>
  );
}
