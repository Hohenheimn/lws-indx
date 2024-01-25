import React, { useEffect, useState } from "react";
import { Checkbox, DatePicker, Form, Popover, Table, notification } from "antd";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { scroller } from "react-scroll";
import { twMerge } from "tailwind-merge";
import { Button } from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";

import { useQuery } from "@tanstack/react-query";

import { fetchData } from "@utilities/api";
import { numberSeparator } from "@utilities/helpers";

import AddTreatmentRecordModal from "./AddTreatmentRecordModal";
import { BillingColumns, PaymentColumns, RecordColumns } from "./Columns";
import CreateBillingStatementModal from "./CreateBillingStatementModal";
import CreatePaymentModal from "./CreatePaymentModal";
import PerCertainAmountModal from "./PayCertainAmountModal";
import PreviewModal, { TreatmentRecordType } from "./PreviewModal";
import TreatmentRecordTable from "./Table";
import { SelectedTreatment, SelectedBilling, SelectedPayment } from "./types";
import ViewPaymentModal from "./ViewPaymentModa";

export function TreatmentRecords({ patientRecord, pageType, currency }: any) {
  const [TreatmentRecordForm] = Form.useForm();

  const [SelectedTreatments, setSelectedTreatments] = useState<
    SelectedTreatment[]
  >([]);

  const [SelectedBilling, setSelectedBilling] = useState<SelectedBilling[]>([]);

  const [SelectedPayment, setSelectedPayment] = useState<SelectedPayment[]>([]);

  let [previewModal, setPreviewModal] = React.useState(false);

  let [
    previewModalData,
    setPreviewModalData,
  ] = React.useState<TreatmentRecordType | null>(null);

  let { data: invoiceTotal, isLoading: invoiceTotalLoading } = useQuery(
    ["invoice-total", patientRecord?._id],
    () =>
      fetchData({
        url: `/api/patient/invoice/total/${patientRecord?._id}`,
      })
  );

  const TableRecordColumns = RecordColumns(
    SelectedTreatments,
    setSelectedTreatments,
    pageType,
    (data: any) => {
      setPreviewModalData(data);
      setPreviewModal(true);
    }
  );

  const TableBillingColumns = BillingColumns(
    SelectedBilling,
    setSelectedBilling,
    pageType,
    currency
  );

  const TablePaymentColumns = PaymentColumns(
    SelectedPayment,
    setSelectedPayment,
    pageType,
    currency,
    patientRecord?._id
  );

  let [
    isTreatmentRecordModalOpen,
    setIsTreatmentRecordModalOpen,
  ] = React.useState(false);

  let [
    isPayCertainAmountModalOpen,
    setPayCertainAmountModalOpen,
  ] = React.useState(false);

  let [
    isCreateBillingStatementModalOpen,
    setCreateBillingStatementModalOpen,
  ] = React.useState(false);

  let [createPaymentModalOpen, setCreatePaymentModalOpen] = React.useState(
    false
  );

  let [viewPaymentModal, setViewPaymentModal] = React.useState(false);

  const tabs = ["Records", "Billings", "Payment History"];

  const [isTabActive, setTabActive] = useState("Records");

  useEffect(() => {
    setSelectedBilling([]);
    setSelectedTreatments([]);
    setSelectedPayment([]);
  }, [isTabActive]);

  let [search, setSearch] = React.useState("");

  const Title = () => {
    return (
      <div className="space-y-8 h">
        <div className="space-y-4 md:p-12 p-6 !pb-0">
          <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
            <h4 className="basis-full md:basis-auto">Treatment Records</h4>
          </div>
          <div className="flex justify-between w-full">
            <div>
              <Input
                placeholder="Search"
                prefix={<AiOutlineSearch className="text-lg text-casper-500" />}
                className="rounded-full text-base shadow-none"
                onChange={(e: any) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <Button
                className="p-3 max-w-xs"
                appearance="primary"
                onClick={() => {
                  setIsTreatmentRecordModalOpen(true);
                }}
              >
                Create New Treatment
              </Button>
            </div>
          </div>
        </div>

        <ul className="flex flex-auto md:px-12 px-6">
          {tabs?.map((row, index) => (
            <li
              key={index}
              className={`cursor-pointer mr-5 ${row === isTabActive &&
                " text-primary-500 border-b border-primary-500"}`}
              onClick={() => setTabActive(row)}
            >
              {row}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <>
      <div className=" flex justify-start">
        <Card className="px-8 bg-primary-500">
          <p className="text-white">Current Remaining Balance</p>
          <h1 className="text-white my-1">
            {currency} {numberSeparator(invoiceTotal ? invoiceTotal : 0, 0)}
          </h1>
          <h5
            className={` text-lg cursor-pointer font-semibold border-b border-white inline ${
              pageType === "view"
                ? "text-gray-300 pointer-events-none border-gray-300"
                : " border-white text-white"
            }`}
            onClick={() => setPayCertainAmountModalOpen(true)}
          >
            Pay Certain Amount
          </h5>
        </Card>
      </div>

      <div className="flex flex-auto mt-5">
        {isTabActive === "Records" && (
          <TreatmentRecordTable
            TableColumns={TableRecordColumns}
            Endpoint={"patient/treatment"}
            queryName="treatment-record"
            patientRecord={patientRecord}
            search={search}
            Title={<Title />}
            currency={currency}
          />
        )}
        {isTabActive === "Billings" && (
          <TreatmentRecordTable
            queryName="invoice"
            TableColumns={TableBillingColumns}
            Endpoint="patient/invoice"
            patientRecord={patientRecord}
            search={search}
            Title={<Title />}
            currency={currency}
          />
        )}
        {isTabActive === "Payment History" && (
          <TreatmentRecordTable
            TableColumns={TablePaymentColumns}
            Endpoint="patient/payment"
            queryName="payment"
            patientRecord={patientRecord}
            search={search}
            Title={<Title />}
            currency={currency}
          />
        )}
      </div>

      <AddTreatmentRecordModal
        show={isTreatmentRecordModalOpen}
        onClose={() => {
          setIsTreatmentRecordModalOpen(false);
          TreatmentRecordForm.resetFields();
        }}
        className="w-[50rem]"
        id="treatment-record-modal"
        currency={currency}
        patientRecord={patientRecord}
        form={TreatmentRecordForm}
      />
      <PerCertainAmountModal
        show={isPayCertainAmountModalOpen}
        onClose={() => {
          setPayCertainAmountModalOpen(false);
        }}
        CertainAmount={invoiceTotal ? invoiceTotal : 0}
        className="w-[75rem]"
        id="pay-certain-amount"
        patientRecord={patientRecord}
        currency={currency}
      />
      <CreateBillingStatementModal
        show={isCreateBillingStatementModalOpen}
        onClose={() => {
          setCreateBillingStatementModalOpen(false);
        }}
        className="w-[50rem]"
        id="create-billing-statement"
        patientRecord={patientRecord}
        SelectedTreatments={SelectedTreatments}
        setSelectedTreatments={setSelectedTreatments}
        currency={currency}
      />
      {/* Billing tab payment */}
      <CreatePaymentModal
        show={createPaymentModalOpen}
        onClose={() => {
          setCreatePaymentModalOpen(false);
        }}
        className="w-[75rem]"
        id="create-payment"
        patientRecord={patientRecord}
        SelectedBilling={SelectedBilling}
        setSelectedBilling={setSelectedBilling}
        currency={currency}
      />

      <ViewPaymentModal
        show={viewPaymentModal}
        onClose={() => {
          setViewPaymentModal(false);
        }}
        id="create-payment"
        patientRecord={patientRecord}
        SelectedPayment={SelectedPayment}
        currency={currency}
      />

      <PreviewModal
        show={previewModal}
        onClose={() => {
          setPreviewModal(false);
        }}
        previewData={previewModalData}
        currency={currency}
      />

      {(SelectedTreatments.length > 0 ||
        SelectedBilling.length > 0 ||
        SelectedPayment.length > 0) && (
        <div className=" fixed w-full bottom-0 left-0 bg-primary-500 text-white py-3 px-10 flex justify-end items-center space-x-8">
          <p className=" text-lg">
            {isTabActive === "Records" && SelectedTreatments.length}
            {isTabActive === "Payment History" && SelectedPayment.length}
            {isTabActive === "Billings" && SelectedBilling.length} Item Selected
          </p>

          <div>
            <Button
              className="text-white font-semibold "
              onClick={() => {
                isTabActive === "Records" &&
                  setCreateBillingStatementModalOpen(true);
                isTabActive === "Billings" && setCreatePaymentModalOpen(true);
                isTabActive === "Payment History" && setViewPaymentModal(true);
              }}
            >
              {isTabActive === "Records" && "Proceed To Billing Statement"}
              {isTabActive === "Billings" && "Pay Selected Billing"}
              {isTabActive === "Payment History" && "View Payment History"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default TreatmentRecords;
