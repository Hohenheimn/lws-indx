import React, { useState } from "react";
import { DatePicker, Form, notification } from "antd";
import { data } from "autoprefixer";
import moment from "moment";
import { scroller } from "react-scroll";
import Annotate from "@components/Annotate";
import Input from "@components/Input";
import Modal from "@components/Modal";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@utilities/api";

export default function AnnotationModal({
  show,
  onClose,
  SelectedAnnotate,
  UpdateToothsHandler,
  form,
  ChartView,
  ...rest
}: any) {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  let { data: proceduresList, isLoading: procedureListLoading } = useQuery(
    ["procedure-list", page, search],
    () =>
      fetchData({
        url: `/api/procedure?limit=9&page=${page}&search=${search}`,
      })
  );

  return (
    <Modal show={show} onClose={onClose} {...rest}>
      <div className="space-y-4">
        <h1 className="text-center">{SelectedAnnotate?.tooth_no}</h1>
        <div className="h-full w-full max-h-[20rem] max-w-[20rem] m-auto">
          <Annotate
            // disabled={true}
            defaultValue={SelectedAnnotate}
            UpdateToothsHandler={UpdateToothsHandler}
            image={
              ChartView === "Standard" ||
              ChartView === undefined ||
              ChartView === "All"
                ? "/images/tooth-standard.png"
                : `/images/tooth-periodontal.png`
            }
            ProceduresData={proceduresList?.data}
            setSearch={setSearch}
          />
        </div>
      </div>
    </Modal>
  );
}
