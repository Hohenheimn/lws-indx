import React, { useEffect, useState } from "react";
import moment from "moment";
import Modal from "@components/Modal";
import { Button } from "@src/components/Button";

import { numberSeparator } from "@utilities/helpers";

import { SelectedPayment } from "./types";

export type TreatmentRecordType = {
  amount: number;
  branch: string;
  branch_name: string;
  chart_id: string;
  chart_name: string;
  created_at: string;
  doctor_id: string;
  doctor_name: string;
  patient_id: string;
  procedure_cost: number;
  procedure_id: string;
  procedure_name: string;
  quantity: string;
  remarks: string;
  status: string;
  surface: string;
  tooth_no: number[];
  _id: string;
};

export default function PreviewModal({
  show,
  onClose,
  previewData,
  currency,
  ...rest
}: {
  show: boolean;
  onClose: any;
  currency: any;
  previewData: TreatmentRecordType | null;
}) {
  return (
    <>
      <Modal
        show={show}
        onClose={() => {
          onClose();
        }}
        {...rest}
        className=" space-y-5 w-[50rem]"
      >
        <div className="font-bold text-3xl">Preview</div>

        <ul className=" grid grid-cols-2 gap-x-5 gap-y-10">
          <li className=" col-span-2 sm:col-span-1">
            <p>Date Created</p>
            <h3>{moment(previewData?.created_at).format("MMMM DD, YYYY")}</h3>
          </li>
          <li className=" col-span-2 sm:col-span-1">
            <p>Dentist</p>
            <h3>{previewData?.doctor_name}</h3>
          </li>
          <li className=" col-span-2 sm:col-span-1">
            <p>Branch</p>
            <h3>{previewData?.branch_name}</h3>
          </li>
          <li className=" col-span-2 sm:col-span-1">
            <p>Surface</p>
            <h3>{previewData?.surface}</h3>
          </li>
          <li className=" col-span-2 sm:col-span-1">
            <p>Procedure</p>
            <h3>{previewData?.procedure_name}</h3>
          </li>
          <li className=" col-span-2 sm:col-span-1">
            <p>Dentist</p>
            <h3>{previewData?.status}</h3>
          </li>
          <li className=" col-span-2">
            <p>Tooth No.</p>
            <h3>{previewData?.tooth_no.join(", ")}</h3>
          </li>
          <li className=" col-span-2 sm:col-span-1">
            <p>Quantity</p>
            <h3>{previewData?.quantity}</h3>
          </li>
          <li className=" col-span-2 sm:col-span-1">
            <p>Remarks</p>
            <h3>{previewData?.remarks}</h3>
          </li>
        </ul>

        <div className=" w-full flex justify-end">
          <Button appearance="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
