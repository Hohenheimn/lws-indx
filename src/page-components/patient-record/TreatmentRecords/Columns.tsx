import { useEffect, useState } from "react";
import { Checkbox, Tooltip } from "antd";
import moment from "moment";
import Link from "next/link";

import { AiOutlinePrinter } from "react-icons/ai";

import { BsTrash } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import { numberSeparator, paymentStatusPalette } from "@utilities/helpers";

import {
  treatmentRecord,
  SelectedTreatment,
  SelectedBilling,
  SelectedPayment,
  Invoice,
  payment,
} from "./types";

export const RecordColumns = (
  SelectedTreatments: SelectedTreatment[],
  setSelectedTreatments: Function,
  pageType: string,
  onClick: (data: any) => void
) => {
  const columns: any = [
    {
      title: "",
      dataIndex: "checkbox",
      render: (_: any, record: treatmentRecord) => (
        <>
          {record.status !== "billed" && (
            <Checkbox
              disabled={pageType === "view"}
              checked={SelectedTreatments.some(
                (someItem) => someItem.treatment_id === record._id
              )}
              onChange={(e) => {
                // Handle checkbox change event here
                if (
                  !SelectedTreatments.some(
                    (someItem) => someItem.treatment_id === record._id
                  )
                ) {
                  setSelectedTreatments([
                    ...SelectedTreatments,
                    {
                      amount: Number(record.amount),
                      procedure_name: record.procedure_name,
                      treatment_id: record._id,
                      quantity: record.quantity,
                    },
                  ]);
                }
                if (
                  SelectedTreatments.some(
                    (someItem) => someItem.treatment_id === record._id
                  )
                ) {
                  const fitler = SelectedTreatments.filter(
                    (filter) => filter.treatment_id !== record._id
                  );
                  setSelectedTreatments(fitler);
                }
              }}
            />
          )}
        </>
      ),
      width: "10rem",
      align: "center",
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      width: "10rem",
      align: "center",
      render: (created_at: Date, record: any) => {
        return (
          <div onClick={() => onClick(record)}>
            {moment(created_at).format("MMMM DD, YYYY")}
          </div>
        );
      },
    },
    {
      title: "Dentist",
      dataIndex: "doctor_name",
      width: "10rem",
      align: "center",
      render: (value: string, record: any) => {
        return <div onClick={() => onClick(record)}>{value}</div>;
      },
    },
    {
      title: "Branch",
      dataIndex: "branch_name",
      width: "10rem",
      align: "center",
      render: (value: string, record: any) => {
        return <div onClick={() => onClick(record)}>{value}</div>;
      },
    },
    {
      title: "Tooth No.",
      dataIndex: "tooth_no",
      width: "10rem",
      align: "center",
      render: (_: string, record: { tooth_no: string[] }) => {
        return (
          <div onClick={() => onClick(record)} className=" line-clamp-2">
            {record?.tooth_no.length > 0
              ? record?.tooth_no?.join(", ")
              : record?.tooth_no}
          </div>
        );
      },
    },
    {
      title: "Surface",
      dataIndex: "surface",
      width: "10rem",
      align: "center",
      render: (value: string, record: any) => {
        return <div onClick={() => onClick(record)}>{value}</div>;
      },
    },
    {
      title: "Procedure",
      dataIndex: "procedure_name",
      width: "10rem",
      align: "center",
      render: (value: string, record: any) => {
        return <div onClick={() => onClick(record)}>{value}</div>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "10rem",
      align: "center",
      render: (status: string, record: any) => (
        <div
          onClick={() => onClick(record)}
          className={twMerge(
            "capitalize rounded-full w-full flex justify-center items-center p-2 text-xs ",
            paymentStatusPalette(status === null ? "no payment" : status)
          )}
        >
          {status}
        </div>
      ),
    },
  ];
  return columns;
};

export const BillingColumns = (
  SelectedBilling: SelectedBilling[],
  setSelectedBilling: Function,
  pageType: string,
  currency: string
) => {
  const columns: any = [
    {
      title: "",
      dataIndex: "checkbox",
      render: (_: any, record: Invoice) => (
        <>
          {record.status !== "void" && record.status !== "paid" && (
            <Checkbox
              disabled={pageType === "view"}
              checked={SelectedBilling.some(
                (someItem) => someItem.id === record._id
              )}
              onChange={(e) => {
                // Handle checkbox change event here
                if (
                  !SelectedBilling.some(
                    (someItem) => someItem.id === record._id
                  )
                ) {
                  setSelectedBilling([
                    ...SelectedBilling,
                    {
                      id: record._id,
                      balance: record.balance,
                      procedure_name: record.procedure_name,
                      paid_amount: record.paid_amount,
                      charge: record?.total,
                    },
                  ]);
                }
                if (
                  SelectedBilling.some((someItem) => someItem.id === record._id)
                ) {
                  const fitler = SelectedBilling.filter(
                    (filter) => filter.id !== record._id
                  );
                  setSelectedBilling(fitler);
                }
              }}
            />
          )}
        </>
      ),
      width: "10rem",
      align: "center",
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      width: "10rem",
      align: "center",
      render: (created_at: Date) => moment(created_at).format("MMMM DD, YYYY"),
    },
    {
      title: "Branch",
      dataIndex: "branch_name",
      width: "10rem",
      align: "center",
    },
    {
      title: "Procedure",
      dataIndex: "procedure_name",
      width: "10rem",
      align: "center",
    },
    {
      title: "Charge",
      dataIndex: "total",
      width: "10rem",
      align: "center",
      render: (amount: number) => {
        if (amount) {
          return (
            <div className=" text-end">{`${currency} ${numberSeparator(
              amount,
              0
            )}`}</div>
          );
        }
      },
    },
    {
      title: "Remaining Balance",
      dataIndex: "balance",
      width: "10rem",
      align: "center",
      render: (amount: number) => {
        if (amount) {
          return (
            <div className=" text-end">{`${currency} ${numberSeparator(
              amount,
              0
            )}`}</div>
          );
        }
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "10rem",
      align: "center",
      render: (status: string) => (
        <div
          className={twMerge(
            "capitalize rounded-full w-full flex justify-center items-center p-2 text-xs ",
            paymentStatusPalette(status === null ? "no payment" : status)
          )}
        >
          {status}
        </div>
      ),
    },
  ];
  return columns;
};

export const PaymentColumns = (
  SelectedPayment: SelectedPayment[],
  setSelectedPayment: Function,
  pageType: string,
  currency: string,
  patientId: string
) => {
  const columns: any = [
    {
      title: "",
      dataIndex: "checkbox",
      render: (_: any, record: payment) => (
        <Checkbox
          disabled={pageType === "view"}
          checked={SelectedPayment.some(
            (someItem) => someItem._id === record._id
          )}
          onChange={(e) => {
            // Handle checkbox change event here
            if (
              !SelectedPayment.some((someItem) => someItem._id === record._id)
            ) {
              setSelectedPayment([
                ...SelectedPayment,
                {
                  _id: record._id,
                  payment_amount: record.payment_amount,
                  procedure: record.procedure,
                  branch: record.branch,
                },
              ]);
            }
            if (
              SelectedPayment.some((someItem) => someItem._id === record._id)
            ) {
              const fitler = SelectedPayment.filter(
                (filter) => filter._id !== record._id
              );
              setSelectedPayment(fitler);
            }
          }}
        />
      ),
      width: "10rem",
      align: "center",
    },
    {
      title: "Payment Date",
      dataIndex: "payment_date",
      width: "10rem",
      align: "center",
      render: (created_at: Date) => moment(created_at).format("MMMM DD, YYYY"),
    },
    {
      title: "Branch",
      dataIndex: "branch",
      width: "10rem",
      align: "center",
    },
    {
      title: "Procedure",
      dataIndex: "procedure",
      width: "10rem",
      align: "center",
    },
    {
      title: "Payment Method",
      dataIndex: "mode_of_payment",
      width: "10rem",
      align: "center",
    },
    {
      title: "Amount Paid",
      dataIndex: "payment_amount",
      width: "10rem",
      align: "center",
      render: (amount: number) => {
        if (amount) {
          return `${currency} ${numberSeparator(amount, 0)}`;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "",
      width: "5rem",
      align: "center",
      render: (_: any, record: any) => {
        return (
          <div className="w-full flex justify-center space-x-4">
            <Link
              href={`/admin/print?page=treament record payment&patient_id=${patientId}&tableData=${JSON.stringify(
                record
              )}&currency=${currency}`}
              target="_blank"
            >
              <Tooltip title="Print">
                <AiOutlinePrinter className=" text-xl text-gray-400" />
              </Tooltip>
            </Link>
          </div>
        );
      },
    },
  ];
  return columns;
};
