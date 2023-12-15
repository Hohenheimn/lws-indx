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
import ChartingForm from "./ChartingForm";
import { AnnotationType } from "./chartingTypes";
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
  React.useEffect(() => {
    form.setFieldsValue({
      ...form,
      created_at: moment(form?.getFieldValue("created_at")).isValid()
        ? moment(form?.getFieldValue("created_at"))
        : undefined,
    });
  }, [show]);

  return (
    <>
      <Modal
        show={show}
        onClose={() => {}}
        // onClose={onClose}
        {...rest}
      >
        <ChartingForm
          onClose={onClose}
          show={show}
          form={form}
          patientRecord={patientRecord}
          defaultAnnotation={defaultAnnotation}
          pageType={pageType}
        />
      </Modal>
    </>
  );
}
