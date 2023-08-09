import React from "react";
import { Tabs, message, notification } from "antd";
import { format, parseISO, differenceInYears, parse } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/router";
import { BsTrash } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";
import PrivateRoute from "@auth/HOC/PrivateRoute";
import VerifyAuth from "@auth/HOC/VerifyAuth";
import { PageContainer } from "@components/animation";
import Avatar from "@components/Avatar";
import Card from "@components/Card";
import patientRecord from "@pagecomponents/patient-record";
import DeleteButton from "@src/components/DeleteButton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import { NextPageProps } from "@utilities/types/NextPageProps";

interface PatientRecordProps extends NextPageProps {
  selectedPatientID: number;
}

export function PatientRecord({ selectedPatientID }: PatientRecordProps) {
  const queryClient = useQueryClient();

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
            <h3>Patient Record</h3>

            <DeleteButton deleteHandler={() => deletePatient()} />
            <Card className="text-base">
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
                  {/* <div className="flex justify-center items-center gap-3">
                    <Button appearance="link" className="text-lg">
                      <AiOutlineCalendar />
                    </Button>
                    <Button appearance="link" className="text-lg">
                      <BsCameraVideo />
                    </Button>
                    <Button appearance="link" className="text-lg">
                      <BsBoxArrowUpRight />
                    </Button>
                    <Button appearance="link" className="text-lg">
                      <BsPrinter />
                    </Button>
                    <Button appearance="link" className="text-lg">
                      <BsTrash />
                    </Button>
                  </div> */}
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
              activeKey={`${router.query.tab ?? patientRecord("")[0]?.key}`}
              onChange={(e) =>
                router.replace({
                  query: { ...router.query, tab: e },
                })
              }
              items={patientRecord({
                patientRecord: patient,
                tab: router.query.tab ?? "2",
              })}
            />
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
