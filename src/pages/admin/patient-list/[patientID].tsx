import React, { useState } from "react";
import { Tabs, message, notification } from "antd";
import { format, parseISO, differenceInYears, parse } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/router";
import { IoPersonOutline } from "react-icons/io5";
import PrivateRoute from "@auth/HOC/PrivateRoute";
import VerifyAuth from "@auth/HOC/VerifyAuth";
import { AnimateContainer, PageContainer } from "@components/animation";
import Avatar from "@components/Avatar";
import Card from "@components/Card";
import patientRecord from "@pagecomponents/patient-record";
import { fadeIn } from "@src/components/animation/animation";
import DeleteButton from "@src/components/DeleteButton";
import { Radio } from "@src/components/Radio";
import ChangeHistory from "@src/page-components/patient-record/ChangeHistory";
import Charting from "@src/page-components/patient-record/Charting";
import DentalHistory from "@src/page-components/patient-record/DentalHistory";
import MedicalGallery from "@src/page-components/patient-record/MedicalGallery";
import MedicalHistory from "@src/page-components/patient-record/MedicalHistory";
import PersonalInfo from "@src/page-components/patient-record/PersonalInfo";
import Prescription from "@src/page-components/patient-record/Prescription";
import TreatmentPlan from "@src/page-components/patient-record/TreatmentPlan";
import TreatmentRecords from "@src/page-components/patient-record/TreatmentRecords";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import { NextPageProps } from "@utilities/types/NextPageProps";

interface PatientRecordProps extends NextPageProps {
  selectedPatientID: number;
}

export function PatientRecord({ selectedPatientID }: PatientRecordProps) {
  const queryClient = useQueryClient();

  const [pageType, setPageType] = useState("view");

  const { setIsAppLoading } = React.useContext(Context);

  let [isImageError, setIsImageError] = React.useState(false);

  const router = useRouter();

  const { data: patient, isFetching: loadingPatient, isError } = useQuery(
    ["patient", selectedPatientID],
    () =>
      fetchData({
        url: `/api/patient/${selectedPatientID}`,
      })
  );

  const { mutate: deletePatient }: any = useMutation(
    () =>
      deleteData({
        url: `/api/patient/${selectedPatientID}`,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      }),
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Patient Deleted",
          description: "Patient has been deleted",
        });
        router.push("/admin/patient-list");
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey: ["patient"] });
        const previousValues = queryClient.getQueryData(["patient"]);
        queryClient.setQueryData(["patient"], (oldData: any) =>
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
        queryClient.setQueryData(["patient"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({ queryKey: ["patient"] });
      },
    }
  );

  if (isError) {
    return (
      <PageContainer className="flex justify-center items-center">
        <h3>No Patient Record</h3>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer>
        {!loadingPatient ? (
          <>
            <div className=" flex justify-between w-full items-center">
              <h3>Patient Record</h3>
              <Radio.Group
                onChange={(e: string) => setPageType(e)}
                defaultValue="view"
                className="md:max-w-md"
              >
                <Radio.Button value={"view"} label="View" />
                <Radio.Button value={"edit"} label="Edit" />
              </Radio.Group>
            </div>

            <DeleteButton
              label="Delete Patient"
              deleteHandler={() => deletePatient()}
            />

            <Card className="text-base sticky top-0 z-[999999]">
              <div className="grid grid-cols-1 lg:grid-cols-[30%_1fr] items-center gap-8">
                <div className="flex flex-col justify-center items-center gap-4">
                  <Avatar className="h-28 w-28 p-4 overflow-hidden relative border border-gray-300 avatar transition">
                    {!patient?.profile_picture || isImageError ? (
                      <IoPersonOutline className="h-full w-full text-white" />
                    ) : (
                      <Image
                        src={`${patient?.profile_picture}`}
                        alt="Patient's Picture"
                        fill
                        sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                        className="object-center  h-full w-full"
                        objectFit="cover"
                        onError={() => {
                          setIsImageError(true);
                        }}
                      />
                    )}
                  </Avatar>
                  <h5>
                    {patient?.first_name} {patient?.last_name}
                  </h5>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] xs:gap-4">
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-[auto_1fr] xs:gap-4">
                    <div className="after:content-none xs:after:content-[':'] after:pl-2 xs:after:float-right text-gray-400 xs:max-lg:text-right lg:text-left text-center whitespace-nowrap">
                      Patient No
                    </div>
                    <div
                      className="xs:text-left text-center xs:mb-0 mb-4 overflow-hidden overflow-ellipsis cursor-pointer hover:text-primary transition"
                      onClick={() => {
                        navigator.clipboard.writeText(patient?._id);
                        message.success("Copied");
                      }}
                    >
                      {patient?._id}
                    </div>
                    <div className="after:content-none xs:after:content-[':'] after:pl-2 xs:after:float-right text-gray-400 xs:max-lg:text-right lg:text-left text-center whitespace-nowrap">
                      Age
                    </div>
                    <div className="xs:text-left text-center xs:mb-0 mb-4 overflow-hidden overflow-ellipsis">
                      {differenceInYears(
                        new Date(),
                        new Date(patient?.birthdate)
                      ).toString()}
                    </div>
                    <div className="after:content-none xs:after:content-[':'] after:pl-2 xs:after:float-right text-gray-400 xs:max-lg:text-right lg:text-left text-center whitespace-nowrap">
                      Gender
                    </div>
                    <div className="xs:text-left text-center xs:mb-0 mb-4 overflow-hidden overflow-ellipsis">
                      {patient?.gender}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-[auto_1fr] xs:gap-4">
                    <div className="after:content-none xs:after:content-[':'] after:pl-2 xs:after:float-right text-gray-400 xs:max-lg:text-right lg:text-left text-center whitespace-nowrap">
                      Mobile Number
                    </div>
                    <div className="xs:text-left text-center xs:mb-0 mb-4 overflow-hidden overflow-ellipsis">
                      {patient?.mobile_no}
                    </div>
                    <div className="after:content-none xs:after:content-[':'] after:pl-2 xs:after:float-right text-gray-400 xs:max-lg:text-right lg:text-left text-center whitespace-nowrap">
                      Email Address
                    </div>
                    <div className="xs:text-left text-center xs:mb-0 mb-4 overflow-hidden overflow-ellipsis">
                      {patient?.email}
                    </div>
                    <div className="after:content-none xs:after:content-[':'] after:pl-2 xs:after:float-right text-gray-400 xs:max-lg:text-right lg:text-left text-center whitespace-nowrap">
                      Record Last Updated
                    </div>
                    <div className="xs:text-left text-center xs:mb-0 mb-4 overflow-hidden overflow-ellipsis">
                      {format(parseISO("2019-02-11T14:00:00"), "MMMM dd, yyyy")}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
            <Tabs
              activeKey={`${router.query.tab ?? patientRecord()[0]?.key}`}
              onChange={(e) => {
                router.replace({
                  query: { ...router.query, tab: e },
                });
              }}
              items={patientRecord()}
            />

            <AnimateContainer
              variants={fadeIn}
              key={2}
              className="flex flex-col flex-auto"
            >
              {router.query.tab === "2" && (
                <PersonalInfo
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                />
              )}
              {router.query.tab === "3" && (
                <DentalHistory
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                />
              )}
              {router.query.tab === "4" && (
                <MedicalHistory
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                />
              )}
              {router.query.tab === "5" && (
                <TreatmentPlan
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                />
              )}
              {router.query.tab === "6" && (
                <Charting
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                />
              )}
              {router.query.tab === "6" && (
                <TreatmentRecords
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                />
              )}
              {router.query.tab === "7" && (
                <MedicalGallery
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                />
              )}
              {router.query.tab === "8" && (
                <Prescription
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                />
              )}
              {router.query.tab === "9" && (
                <ChangeHistory
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                />
              )}
            </AnimateContainer>
          </>
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <h3>Fetching Patient Record...</h3>
          </div>
        )}
      </PageContainer>
    </>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  let selectedPatientID = ctx.query.patientID;

  return { props: { ...serverSideProps, selectedPatientID } };
});
export default PrivateRoute(PatientRecord);
