import React, { useState } from "react";
import Annotate from "@components/Annotate";
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
  pageType,
  form_id,
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
    <Modal
      show={show}
      onClose={onClose}
      {...rest}
      className=" w-full overflow-visible"
    >
      <div className="space-y-4">
        <h1 className="text-center">{SelectedAnnotate?.tooth_no}</h1>
        <div className="h-full w-full m-auto">
          <Annotate
            // disabled={true}
            defaultValue={SelectedAnnotate}
            UpdateToothsHandler={UpdateToothsHandler}
            image={
              ChartView === "Periodontal" ||
              ChartView === undefined ||
              ChartView === "All"
                ? `/images/teeth_periodontal/${SelectedAnnotate?.tooth_no}.png`
                : `/images/tooth-periodontal.png`
            }
            ProceduresData={proceduresList?.data}
            setSearch={setSearch}
            forModal={true}
            onClose={onClose}
            pageType={pageType}
            formType="edit"
            form_id={form_id}
          />
        </div>
      </div>
    </Modal>
  );
}
