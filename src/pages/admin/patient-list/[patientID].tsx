import React, { useEffect, useRef, useState } from "react";
import { Tabs, message, notification } from "antd";
import { format, parseISO, differenceInYears, parse } from "date-fns";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { IoPersonOutline } from "react-icons/io5";
import PrivateRoute from "@auth/HOC/PrivateRoute";
import VerifyAuth from "@auth/HOC/VerifyAuth";
import { AnimateContainer, PageContainer } from "@components/animation";
import Avatar from "@components/Avatar";
import Card from "@components/Card";
import patientRecord from "@pagecomponents/patient-record";
import { fadeIn, fadeInUp } from "@src/components/animation/animation";
import DeleteButton from "@src/components/DeleteButton";
import { Radio } from "@src/components/Radio";
import Tab from "@src/components/Tab";
import Uploader from "@src/components/Uploader";
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
  profile: {
    setting: {
      currency: string;
    };
  };
}

export function PatientRecord({
  selectedPatientID,
  profile,
}: PatientRecordProps) {
  const queryClient = useQueryClient();

  const [pageType, setPageType] = useState("view");

  const { setIsAppLoading } = React.useContext(Context);

  let [isImageError, setIsImageError] = React.useState(false);

  const router = useRouter();

  let [image, setImage] = React.useState({
    imageUrl: "",
    error: false,
    file: null,
    loading: false,
  });

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

  const elementRef = useRef<any>(null);
  const [isOutOfView, setIsOutOfView] = useState(false);

  const checkOutOfView = () => {
    if (elementRef.current) {
      const { top, bottom } = elementRef.current.getBoundingClientRect();
      const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;
      const outOfView = top > windowHeight || bottom < 50;
      setIsOutOfView(outOfView);
    }
  };

  useEffect(() => {
    const main_container: any = document.querySelector(".main-container");
    main_container.addEventListener("scroll", checkOutOfView);
    checkOutOfView();
    return () => {
      window.removeEventListener("scroll", checkOutOfView);
    };
  }, []);

  React.useEffect(() => {
    if (patient?.profile_picture)
      setImage({
        ...image,
        imageUrl: patient?.profile_picture ? patient?.profile_picture : "/",
      });
  }, [patient]);

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
        <nav
          className={`${
            isOutOfView ? "" : "opacity-0 pointer-events-none"
          } duration-150 flex-wrap ease-linear z-[9999999] flex-col xs:flex-row fixed left-0 top-0 bg-white shadow-md px-5 xs:px-9 w-full pt-5 flex items-center justify-between`}
        >
          <div className="xs:space-x-5 flex items-center flex-col xs:flex-row">
            <aside className=" flex items-center gap-3">
              <aside className=" relative h-10 aspect-square rounded-full object-cover overflow-hidden">
                <Image
                  src={`${
                    patient?.profile_picture ? patient?.profile_picture : "/"
                  }`}
                  fill
                  alt="picture"
                />
              </aside>
              <h5>
                {patient?.first_name} {patient?.last_name}
              </h5>
              <p className="xs:text-left text-center xs:mb-0 overflow-hidden overflow-ellipsis">
                Age:{" "}
                {differenceInYears(
                  new Date(),
                  new Date(patient?.birthdate)
                ).toString()}
              </p>
            </aside>
            <p
              onClick={() => {
                navigator.clipboard.writeText(patient?.patient_no);
                message.success("Copied");
              }}
              className="xs:text-left text-center xs:mb-0 mb-2 overflow-hidden overflow-ellipsis"
            >
              Patient No. {patient?.patient_no}
            </p>
          </div>
          <div>
            <Radio.Group
              onChange={(e: string) => setPageType(e)}
              defaultValue="view"
              className="md:max-w-md"
            >
              <Radio.Button
                value={"view"}
                label="View"
                className=" text-[.5rem] lg:text-[1rem]"
              />
              <Radio.Button
                value={"edit"}
                label="Edit"
                className=" text-[.5rem] lg:text-[1rem]"
              />
            </Radio.Group>
          </div>
          <div className=" py-5 w-full">
            <Tab
              items={[
                `Personal Info`,
                "Dental History",
                "Medical History",
                "Treatment Plan",
                "Charting",
                "Treatment Records",
                "Medical Gallery",
                "Prescription",
                "Change History",
              ]}
              activeTab={
                router?.query.tab === undefined
                  ? "Personal Info"
                  : router?.query.tab
              }
              onClick={(value) => {
                router.replace({
                  query: { ...router.query, tab: value },
                });
              }}
            />
          </div>
        </nav>

        {!loadingPatient ? (
          <>
            <div className=" flex flex-col xs:flex-row justify-between w-full xs:items-center space-y-2 xs:space-y-0 flex-wrap">
              <h3 className=" sm:mb-0 mb-5">Patient Record</h3>
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

            <div ref={elementRef}>
              <Card className="text-base sticky top-0">
                <div className="grid grid-cols-1 lg:grid-cols-[30%_1fr] items-center gap-8">
                  <div className="flex flex-col justify-center items-center gap-4">
                    <aside
                      className={` inline-block ${pageType === "view" &&
                        "pointer-events-none"}`}
                    >
                      <Uploader
                        image={image}
                        setImage={(value: any) => {
                          setImage(value);
                        }}
                        className={`[&_.ant-upload]:!border-0`}
                        id="profile_picture"
                        capture={true}
                      >
                        <div className="space-y-2 text-center">
                          <Avatar className="h-40 w-40 p-8 overflow-hidden relative border border-gray-300 avatar transition">
                            {image.imageUrl ? (
                              <Image
                                src={image.imageUrl}
                                alt="random pics"
                                fill
                                sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                                className="object-center contain h-full w-full object-cover"
                              />
                            ) : (
                              <IoPersonOutline className="h-full w-full text-white" />
                            )}
                          </Avatar>
                          {pageType === "edit" && (
                            <div className="text-casper-500">
                              {image.imageUrl ? "Change" : "Upload"} Profile
                              Picture
                            </div>
                          )}
                        </div>
                      </Uploader>
                    </aside>
                    {/* <Avatar className="h-28 w-28 p-4 overflow-hidden relative border border-gray-300 avatar transition">
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
                    </Avatar> */}
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
                          navigator.clipboard.writeText(patient?.patient_no);
                          message.success("Copied");
                        }}
                      >
                        {patient?.patient_no}
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
                        {format(
                          parseISO("2019-02-11T14:00:00"),
                          "MMMM dd, yyyy"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className=" p-5 bg-white rounded-lg shadow-lg">
              <Tab
                items={[
                  `Personal Info`,
                  "Dental History",
                  "Medical History",
                  "Treatment Plan",
                  "Charting",
                  "Treatment Records",
                  "Medical Gallery",
                  "Prescription",
                  "Change History",
                ]}
                activeTab={router?.query.tab}
                onClick={(value) => {
                  router.replace({
                    query: { ...router.query, tab: value },
                  });
                }}
              />
            </div>

            <AnimateContainer
              variants={fadeIn}
              key={2}
              className="flex flex-col flex-auto"
            >
              {(router.query.tab === "Personal Info" ||
                router.query.tab === undefined) && (
                <PersonalInfo
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                  setImage={setImage}
                  profile_picture={image?.file}
                />
              )}
              {router.query.tab === "Dental History" && (
                <DentalHistory
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                />
              )}
              {router.query.tab === "Medical History" && (
                <MedicalHistory
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                />
              )}
              {router.query.tab === "Treatment Plan" && (
                <TreatmentPlan
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                  currency={profile.setting.currency}
                />
              )}
              {router.query.tab === "Charting" && (
                <Charting
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                  currency={profile.setting.currency}
                />
              )}
              {router.query.tab === "Treatment Records" && (
                <TreatmentRecords
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                  currency={profile.setting.currency}
                />
              )}
              {router.query.tab === "Medical Gallery" && (
                <MedicalGallery
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                />
              )}
              {router.query.tab === "Prescription" && (
                <Prescription
                  patientRecord={patient}
                  pageType={pageType}
                  tab={router.query.tab ?? "2"}
                />
              )}
              {router.query.tab === "Change History" && (
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
