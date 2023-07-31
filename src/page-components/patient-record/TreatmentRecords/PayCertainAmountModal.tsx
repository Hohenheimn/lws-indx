import React, { useEffect, useState } from "react";
import { DatePicker, Form, TimePicker, notification } from "antd";
import TextArea from "antd/lib/input/TextArea";
import search from "antd/lib/transfer/search";
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
import { Select } from "@src/components/Select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData, postData } from "@utilities/api";

import { Context } from "@utilities/context/Provider";

import {
    getInitialValue,
    numberSeparator,
    removeNumberFormatting,
} from "@utilities/helpers";

import AddAndUseCredit from "./AddAndUseCredit";

export default function PerCertainAmountModal({
    show,
    onClose,
    patientRecord,
    ...rest
}: any) {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const { setIsAppLoading } = React.useContext(Context);

    const [addorUseCreditModal, setAddorUseCreditModal] = useState({
        toggle: false,
        type: "",
    });

    const [useCreditAmount, setUseCreditAmount] = useState(0);

    React.useEffect(() => {
        form.setFieldsValue({
            ...form,
            created_at: moment(form?.getFieldValue("created_at")).isValid()
                ? moment(form?.getFieldValue("created_at"))
                : undefined,
        });
    }, [show]);

    let { data: Credit, isLoading: CreditLoading } = useQuery(["credit"], () =>
        fetchData({
            url: `/api/patient/credit/show/${patientRecord._id}`,
        })
    );

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

                setUseCreditAmount(0);
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

                setUseCreditAmount(0);
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
        <>
            <Modal
                show={show}
                onClose={() => {
                    form.resetFields();
                    onClose();

                    setUseCreditAmount(0);
                }}
                {...rest}
            >
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="font-bold text-3xl">
                            Pay Certain Amount
                        </div>
                        <div className="flex justify-end items-center gap-4">
                            <Button
                                appearance=""
                                className="max-w-[10rem] text-primary-500 border border-primary-500 shadow-none"
                                type="submit"
                                onClick={() =>
                                    setAddorUseCreditModal({
                                        toggle: true,
                                        type: "Add",
                                    })
                                }
                            >
                                Add Credits
                            </Button>
                            <Button
                                appearance="primary"
                                className="max-w-[10rem]"
                                type="submit"
                                onClick={() =>
                                    setAddorUseCreditModal({
                                        toggle: true,
                                        type: "Use",
                                    })
                                }
                            >
                                Use Credits
                            </Button>
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

                            console.log(values);

                            let id = form.getFieldValue("_id");

                            // if (!id) {
                            //     addTreatmentPlan(values);
                            // } else {
                            //     values.id = id;
                            //     editTreatmentPlan(values);
                            // }
                        }}
                        onFinishFailed={(data) => {
                            scroller.scrollTo(
                                data?.errorFields[0]?.name
                                    ?.join("-")
                                    ?.toString(),
                                {
                                    smooth: true,
                                    offset: -50,
                                    containerId: rest?.id,
                                }
                            );
                        }}
                        className=" w-full"
                    >
                        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <li className="  space-y-4">
                                <Form.Item
                                    label="Date Created"
                                    name="created_at"
                                    required={false}
                                >
                                    <DatePicker
                                        getPopupContainer={(
                                            triggerNode: any
                                        ) => {
                                            return triggerNode.parentNode;
                                        }}
                                        placeholder="Date Created"
                                        disabled={true}
                                        format="MMMM DD, YYYY"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Mode of Payment"
                                    name="mode_of_payment"
                                    rules={[
                                        {
                                            required: true,
                                            message: "This is required!",
                                        },
                                    ]}
                                    required={false}
                                >
                                    <Select
                                        placeholder="Select Mode of Payment"
                                        id="mode_of_payment"
                                    >
                                        <Select.Option
                                            value={"Cash on Deliver"}
                                        >
                                            Cash on Deliver
                                        </Select.Option>

                                        <Select.Option value={"E-Payment"}>
                                            E-Payment
                                        </Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label="Amount"
                                    name="amount"
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
                                        placeholder="Amount"
                                        id="amount"
                                        prefix="₱"
                                        thousandSeparator
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Remarks"
                                    name="remarks"
                                    rules={[
                                        {
                                            required: true,
                                            message: "This is required!",
                                        },
                                    ]}
                                    required={false}
                                >
                                    <Input id="remarks" placeholder="Remarks" />
                                </Form.Item>
                            </li>
                            <li className="  space-y-4">
                                <p className=" text-end">
                                    Remaining Credit Score:{" "}
                                    {Credit?.amount !== undefined &&
                                        numberSeparator(Credit?.amount, 0)}
                                </p>
                                <p className=" text-end">
                                    Use Credit Score:{" "}
                                    {Credit?.amount !== undefined &&
                                        numberSeparator(useCreditAmount, 0)}
                                </p>
                                <div className="p-8 border border-primary-500 rounded-md space-y-4">
                                    <h4 className="text-lg">
                                        Billing Statement
                                    </h4>
                                    <ul className=" space-y-4">
                                        <li className=" pb-2 border-b border-primary-500 flex justify-between">
                                            <p>Certain Amount Payment</p>
                                            <p className="pr-4">Php 0</p>
                                        </li>
                                        <li className=" pb-2 border-b border-primary-500 flex justify-between">
                                            <p>Total</p>
                                            <p className="pr-4">Php 0</p>
                                        </li>
                                        <li className=" pb-2 flex justify-between">
                                            <p className=" font-bold">
                                                Total Remaining Balance
                                            </p>
                                            <p className="pr-4">
                                                Php {numberSeparator(50000, 0)}
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex justify-end items-center gap-4">
                                    <Button
                                        appearance="link"
                                        className="p-4 bg-transparent border-none text-casper-500 font-semibold"
                                        onClick={() => {
                                            form.resetFields();
                                            onClose();

                                            setUseCreditAmount(0);
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
                            </li>
                        </ul>
                    </Form>
                    <div className="w-full flex justify-center">
                        <h3 className=" text-center text-lg">
                            Note: By paying a certain amount, take note that
                            this will be deducted to the oldest Billing.
                        </h3>
                    </div>
                </div>
                <AddAndUseCredit
                    show={addorUseCreditModal.toggle}
                    actionType={addorUseCreditModal.type}
                    onCloseSecondModal={() => {
                        setAddorUseCreditModal({
                            type: "",
                            toggle: false,
                        });
                    }}
                    remainingCredit={Credit?.amount}
                    className="w-[25rem]"
                    id="add-or-use-credit"
                    patientRecord={patientRecord}
                    setUseCreditAmount={setUseCreditAmount}
                />
            </Modal>
        </>
    );
}
