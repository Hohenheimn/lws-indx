import React from "react";
import { DatePicker, Form, TimePicker, notification } from "antd";
import { Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import Image from "next/image";
import { AiFillMinusCircle } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";
import { NumericFormat } from "react-number-format";
import { scroller } from "react-scroll";
import { AnimateContainer } from "@components/animation";
import { fadeIn } from "@components/animation/animation";
import { Button } from "@components/Button";
import { InfiniteSelect } from "@components/InfiniteSelect";
import Input from "@components/Input";
import Modal from "@components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData, postData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import { getInitialValue, removeNumberFormatting } from "@utilities/helpers";

export default function AddTreatmentRecordModal({
    show,
    onClose,
    form,
    patientRecord,
    ...rest
}: any) {
    const queryClient = useQueryClient();
    const { setIsAppLoading } = React.useContext(Context);

    React.useEffect(() => {
        form.setFieldsValue({
            ...form,
            created_at: moment(form?.getFieldValue("created_at")).isValid()
                ? moment(form?.getFieldValue("created_at"))
                : undefined,
        });
    }, [show]);

    const { mutate: addTreatmentPlan } = useMutation(
        (payload: any) => {
            return postData({
                url: `/api/patient/treatment-plan/${patientRecord?._id}`,
                payload,
                options: {
                    isLoading: (show: boolean) => setIsAppLoading(show),
                },
            });
        },
        {
            onSuccess: async (res) => {
                notification.success({
                    message: "Adding Treatment Plan Success",
                    description: `Adding Treatment Plan Success`,
                });
                form.resetFields();
                onClose();
            },
            onMutate: async (newData) => {
                await queryClient.cancelQueries({
                    queryKey: ["treatment-plan"],
                });
                const previousValues = queryClient.getQueryData([
                    "treatment-plan",
                ]);
                queryClient.setQueryData(["treatment-plan"], (oldData: any) =>
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
                queryClient.setQueryData(
                    ["treatment-plan"],
                    context.previousValues
                );
            },
            onSettled: async () => {
                queryClient.invalidateQueries({ queryKey: ["treatment-plan"] });
            },
        }
    );

    const { mutate: editTreatmentPlan } = useMutation(
        (payload: any) => {
            return postData({
                url: `/api/patient/treatment-plan/update/${payload.id}?_method=PUT`,
                payload,
                options: {
                    isLoading: (show: boolean) => setIsAppLoading(show),
                },
            });
        },
        {
            onSuccess: async (res) => {
                notification.success({
                    message: "Treatment Plan Updated!",
                    description: `Treatment Plan Updated!`,
                });
                form.resetFields();
                onClose();
            },
            onMutate: async (newData) => {
                await queryClient.cancelQueries({
                    queryKey: ["treatment-plan"],
                });
                const previousValues = queryClient.getQueryData([
                    "treatment-plan",
                ]);
                queryClient.setQueryData(["treatment-plan"], (oldData: any) =>
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
                queryClient.setQueryData(
                    ["treatment-plan"],
                    context.previousValues
                );
            },
            onSettled: async () => {
                queryClient.invalidateQueries({ queryKey: ["treatment-plan"] });
            },
        }
    );

    return (
        <Modal show={show} onClose={onClose} {...rest}>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-3xl">
                        New Treatment Record
                    </div>
                </div>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values: any) => {
                        values.cost = removeNumberFormatting(values.cost);
                        values.discount = removeNumberFormatting(
                            values.discount
                        );
                        delete values.cost;
                        delete values.date_created;
                        let treatment_plan_list = values.treatment_plan_list.map(
                            (itemMap: any) => {
                                return {
                                    ...itemMap,
                                    cost: removeNumberFormatting(itemMap.cost),
                                };
                            }
                        );

                        values.treatment_plan_list = JSON.stringify(
                            treatment_plan_list
                        );

                        let id = form.getFieldValue("_id");

                        if (!id) {
                            addTreatmentPlan(values);
                        } else {
                            values.id = id;
                            editTreatmentPlan(values);
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
                        <Form.Item
                            label="Reason for Last Visit"
                            name="last_visit_reason"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Reason for Last Visit is required",
                                },
                            ]}
                            required={false}
                            className="col-span-12"
                        >
                            <InfiniteSelect
                                placeholder="Select Reason for Visit"
                                id="last_visit_reason"
                                api={`${process.env.REACT_APP_API_BASE_URL}/api/procedure?limit=3&for_dropdown=true&page=1`}
                                queryKey={["procedure"]}
                                displayValueKey="name"
                                returnValueKey="_id"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Estimated Cost"
                            name="estimated_cost"
                            rules={[
                                {
                                    required: true,
                                    message: "This is required!",
                                },
                            ]}
                            required={false}
                        >
                            <NumericFormat
                                customInput={Input}
                                placeholder="Estimated Cost"
                                id="estimated_cost"
                                prefix="₱"
                                thousandSeparator
                            />
                        </Form.Item>
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
