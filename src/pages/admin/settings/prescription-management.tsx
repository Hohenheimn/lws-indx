import React from "react";
import PrivateRoute from "@auth/HOC/PrivateRoute";
import VerifyAuth from "@auth/HOC/VerifyAuth";
import { AnimateContainer, PageContainer } from "@components/animation";
import { fadeIn } from "@components/animation/animation";
import { Radio } from "@components/Radio";
import MedicineList from "@pagecomponents/prescription-management/MedicineList";
import PrescriptionTemplate from "@pagecomponents/prescription-management/PrescriptionTemplate";
import { NextPageProps } from "@utilities/types/NextPageProps";

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
