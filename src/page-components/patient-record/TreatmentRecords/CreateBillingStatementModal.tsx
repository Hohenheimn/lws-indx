import React, { useState } from "react";
import {
    Checkbox,
    DatePicker,
    Form,
    Radio,
    Table,
    TimePicker,
    notification,
} from "antd";
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
import {
    getInitialValue,
    numberSeparator,
    removeNumberFormatting,
} from "@utilities/helpers";

import { SelectedTreatment, treatmentRecord } from ".";

const columns: any = [
    {
        title: "Procedure",
        dataIndex: "procedure_name",
        width: "10rem",
        align: "center",
    },
    {
        title: "Charge",
        dataIndex: "amount",
        width: "10rem",
        align: "center",
    },
];

export default function CreateBillingStatementModal({
    show,
    onClose,
    patientRecord,
    SelectedTreatments,
    ...rest
}: any) {
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const { setIsAppLoading } = React.useContext(Context);

    const [isProcedureTotal, setProcedureTotal] = useState(0);

    React.useEffect(() => {
        setProcedureTotal(0);
        SelectedTreatments.map((item: SelectedTreatment) => {
            setProcedureTotal((prevVal) => prevVal + Number(item.amount));
        });
    }, [SelectedTreatments]);

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
                queryClient.invalidateQueries({
                    queryKey: ["treatment-plan"],
                });
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
                queryClient.invalidateQueries({
                    queryKey: ["treatment-plan"],
                });
            },
        }
    );

    return (
        <Modal
            show={show}
            onClose={() => {
                form.resetFields();
                onClose();
            }}
            {...rest}
        >
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-3xl">
                        Create Billing Statement
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
                            data?.errorFields[0]?.name?.join("-")?.toString(),
                            {
                                smooth: true,
                                offset: -50,
                                containerId: rest?.id,
                            }
                        );
                    }}
                    className=" w-full space-y-8"
                >
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
                            disabled={true}
                            format="MMMM DD, YYYY"
                        />
                    </Form.Item>

                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={SelectedTreatments}
                        showHeader={true}
                        tableLayout="fixed"
                        bordered
                        pagination={{
                            pageSize: 5,
                            hideOnSinglePage: true,
                            showSizeChanger: false,
                        }}
                        components={{
                            table: ({ ...rest }: any) => {
                                // let tableFlexGrow = rest?.children[2]?.props?.data?.length / 5;
                                let tableFlexGrow = 1;
                                return (
                                    <table
                                        {...rest}
                                        style={{
                                            flex: `${
                                                tableFlexGrow
                                                    ? tableFlexGrow
                                                    : 1
                                            } 1 auto`,
                                        }}
                                    />
                                );
                            },
                            body: {
                                row: ({ ...rest }: any) => {
                                    return <tr {...rest} />;
                                },
                            },
                        }}
                    />
                    <div>
                        <Form.Item
                            name="deductions"
                            required={false}
                            className="text-base"
                        >
                            <Checkbox.Group className="grid grid-cols-1 gap-1 justify-center text-lg">
                                <Checkbox value="VAT Exemption">
                                    VAT Exclusive
                                </Checkbox>
                                <Checkbox value="Senior Citizen Discount">
                                    Senior Citizen Discount
                                </Checkbox>
                            </Checkbox.Group>
                        </Form.Item>
                    </div>
                    <div>
                        <p className="mb-1">Choose Type of Discount</p>
                        <Form.Item
                            name="type_of_discount"
                            required={false}
                            className="text-base"
                        >
                            <Radio.Group
                                id="type_of_discount"
                                className="grid grid-cols-1 gap-1 text-lg"
                            >
                                <Radio value="Amount Discount">
                                    Amoun Discount
                                </Radio>
                                <Radio value="Percent Discount">
                                    Percent Discount
                                </Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    <Form.Item
                        name="discount_amount"
                        required={false}
                        className="text-base"
                    >
                        <NumericFormat
                            customInput={Input}
                            placeholder="Enter Discount Amount"
                            id="discount_amount"
                            prefix="₱"
                            thousandSeparator
                        />
                    </Form.Item>
                    <div className=" border border-gray-300" />
                    <div className="flex justify-end">
                        <h4>Total: {numberSeparator(isProcedureTotal, 0)}</h4>
                    </div>
                    <div className="flex justify-end items-center gap-4">
                        <Button
                            appearance="link"
                            className="p-4 bg-transparent border-none text-casper-500 font-semibold"
                            onClick={() => {
                                form.resetFields();
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
    );
}
