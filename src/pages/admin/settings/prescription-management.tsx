import React from "react";
import { AnimateContainer, PageContainer } from "../../../components/animation";
import PrivateRoute from "../../../auth/HOC/PrivateRoute";
import VerifyAuth from "../../../auth/HOC/VerifyAuth";
import { NextPageProps } from "../../../../utils/types/NextPageProps";
import PrescriptionTemplate from "../../../page-components/prescription-management/PrescriptionTemplate";
import { Radio } from "../../../components/Radio";
import { fadeIn } from "../../../components/animation/animation";
import MedicineList from "../../../page-components/prescription-management/MedicineList";

export function PrescriptionManagement({}: NextPageProps) {
  let [pageContent, setPageContent] = React.useState("1");
  return (
    <>
      <PageContainer>
        <div className="flex justify-between items-center gap-4 flex-wrap lg:flex-nowrap mb-4">
          <h3 className="basis-auto whitespace-nowrap text-ellipsis overflow-hidden">
            Prescription Management
          </h3>
          <Radio.Group
            onChange={(e: string) => setPageContent(e)}
            defaultValue="1"
            className="lg:max-w-md"
          >
            <Radio.Button value="1" label="Prescription Template" />
            <Radio.Button value="2" label="Medicine List" />
          </Radio.Group>
        </div>
        {pageContent === "1" ? <PrescriptionTemplate /> : <MedicineList />}
      </PageContainer>
    </>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(PrescriptionManagement);
