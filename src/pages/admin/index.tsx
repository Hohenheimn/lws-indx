import React from "react";
import { AnimateContainer, PageContainer } from "../../components/animation";
import Form from "antd/lib/form";
import Input from "../../components/Input";
import { Button } from "../../components/Button";
import "chart.js/auto";
import { IoIosAdd } from "react-icons/io";
import {
  AiOutlineSearch,
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineStop,
} from "react-icons/ai";
import {
  BsCameraVideo,
  BsCheck2Square,
  BsPencilSquare,
  BsTrash,
} from "react-icons/bs";
import Calendar from "../../components/Calendar";
import Card from "../../components/Card";
import { format, parseISO } from "date-fns";
import { fadeIn } from "../../components/animation/animation";
import PrivateRoute from "../../auth/HOC/PrivateRoute";
import VerifyAuth from "../../auth/HOC/VerifyAuth";
import { NextPageProps } from "../../../utils/types/NextPageProps";
import AddScheduleModal from "../../page-components/dashboard/modals/AddScheduleModal";
import AddPatientModal from "../../page-components/dashboard/modals/AddPatientModal";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchData } from "../../../utils/api";
import { useInView } from "react-intersection-observer";
import { InfiniteSelect } from "../../components/InfiniteSelect";

export function Dashboard({}: NextPageProps) {
  let [selectedDate, setSelectedDate] = React.useState({
    dateStart: new Date(),
    dateEnd: new Date(),
  });
  let [doctorFilter, setDoctorFilter] = React.useState("");
  let [branchFilter, setBranchFilter] = React.useState("");
  let [isScheduleModalOpen, setIsScheduleModalOpen] = React.useState(false);
  let [isPatientModalOpen, setIsPatientModalOpen] = React.useState(false);
  const [ScheduleForm] = Form.useForm();
  const [RegistrationForm] = Form.useForm();

  const { ref: scheduleRef, inView: scheduleRefInView } = useInView({
    triggerOnce: false,
    rootMargin: "0px",
  });

  // const {
  //   data: branchList,
  //   isFetching: isBranchListLoading,
  //   hasNextPage: branchListHasNextPage,
  //   fetchNextPage: branchListFetchNextPage,
  // } = useInfiniteQuery({
  //   queryKey: ["branchList"],
  //   queryFn: ({
  //     pageParam = `${process.env.REACT_APP_API_BASE_URL}/api/branch?limit=3&for_dropdown=true&page=1`,
  //   }) => {
  //     return fetchData({
  //       url: pageParam,
  //       options: {
  //         noBaseURL: true,
  //       },
  //     });
  //   },
  //   getNextPageParam: (lastPage, pages) => {
  //     if (pages.slice(-1).pop().links.next) {
  //       return pages.slice(-1).pop().links.next;
  //     }
  //   },
  // });

  // const {
  //   data: doctorsList,
  //   isFetching: isDoctorsListLoading,
  //   hasNextPage: doctorsListHasNextPage,
  //   fetchNextPage: doctorsListFetchNextPage,
  // } = useInfiniteQuery({
  //   queryKey: ["doctorsList"],
  //   queryFn: ({
  //     pageParam = `${process.env.REACT_APP_API_BASE_URL}/api/account?limit=3&for_dropdown=true&page=1`,
  //   }) => {
  //     return fetchData({
  //       url: pageParam,
  //       options: {
  //         noBaseURL: true,
  //       },
  //     });
  //   },
  //   getNextPageParam: (lastPage, pages) => {
  //     if (pages.slice(-1).pop().links.next) {
  //       return pages.slice(-1).pop().links.next;
  //     }
  //   },
  // });

  const {
    data: scheduleList,
    isFetching: isScheduleListLoading,
    hasNextPage: scheduleListHasNextPage,
    fetchNextPage: scheduleListFetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["scheduleList"],
    queryFn: ({
      pageParam = `${process.env.REACT_APP_API_BASE_URL}/api/schedule?limit=3`,
    }) => {
      return fetchData({
        url: pageParam,
        options: {
          noBaseURL: true,
        },
      });
    },
    getNextPageParam: (lastPage, pages) => {
      if (pages.slice(-1).pop().links.next) {
        return pages.slice(-1).pop().links.next;
      }
    },
  });

  const flattenScheduleList = scheduleList?.pages
    ? scheduleList?.pages?.flatMap((page) => [...page.data])
    : [];

  React.useEffect(() => {
    if (scheduleListHasNextPage && scheduleRefInView) {
      scheduleListFetchNextPage();
    }
  }, [
    scheduleRefInView,
    scheduleListFetchNextPage,
    scheduleListHasNextPage,
    scheduleList,
  ]);

  // const filteredPatients = fakePatients.filter((patient) => {
  //   if (!isEqual(selectedDate.dateEnd, selectedDate.dateStart)) {
  //     return (
  //       (((patient.doctor.toLowerCase().includes(doctorFilter.toLowerCase()) &&
  //         patient.branch.toLowerCase().includes(branchFilter.toLowerCase()) &&
  //         isBefore(selectedDate.dateStart, patient.schedule)) ||
  //         isEqual(selectedDate.dateStart, patient.schedule)) &&
  //         isAfter(selectedDate.dateEnd, patient.schedule)) ||
  //       isEqual(selectedDate.dateEnd, patient.schedule)
  //     );
  //   } else
  //     return (
  //       patient.doctor.toLowerCase().includes(doctorFilter.toLowerCase()) &&
  //       patient.branch.toLowerCase().includes(branchFilter.toLowerCase())
  //     );
  // });

  return (
    <>
      <PageContainer>
        <h3>Dashboard</h3>
        <div className="flex justify-between items-center gap-4 flex-wrap lg:flex-nowrap">
          <div className="basis-full lg:basis-1/2">
            <Input
              placeholder="Search"
              prefix={<AiOutlineSearch className="text-lg text-casper-500" />}
              className="rounded-full border-none text-lg"
            />
          </div>
          <div className="basis-full lg:basis-auto flex-wrap xs:flex-nowrap flex gap-4">
            <Button
              className="p-3 w-full"
              onClick={() => setIsScheduleModalOpen(true)}
              appearance="primary"
            >
              <div className="flex justify-center items-center">
                <IoIosAdd className="inline-block text-2xl" />{" "}
                <span>Add New Schedule</span>
              </div>
            </Button>
            <Button
              className="p-3 w-full"
              appearance="primary"
              onClick={() => setIsPatientModalOpen(true)}
            >
              <div className="flex justify-center items-center">
                <IoIosAdd className="inline-block text-2xl" />{" "}
                <span>Add New Patient</span>
              </div>
            </Button>
          </div>
        </div>
        <div className="flex flex-col flex-auto">
          <div className="flex justify-start xl:justify-between gap-4 xl:mt-10 flex-wrap flex-auto">
            <div className="basis-full xl:basis-[45%] max-h-[30rem]">
              <Calendar
                onChange={(
                  value: React.SetStateAction<{
                    dateStart: Date;
                    dateEnd: Date;
                  }>
                ) => setSelectedDate(value)}
              />
            </div>
            <div className="basis-full xl:basis-[45%] space-y-4 mt-4 xl:mt-0 flex flex-col">
              <div className="text-2xl font-medium">UPCOMING APPOINMENTS</div>
              <div className="grid grid-cols-12 items-center gap-4">
                <div className="text-sm text-casper-500 font-medium col-span-12 xs:col-span-2">
                  FILTER BY:
                </div>
                <div className="text-sm font-medium col-span-12 xs:col-span-5">
                  <InfiniteSelect
                    placeholder="Select Doctor"
                    onChange={(e) => setDoctorFilter(e)}
                    className="border-none"
                    api={`${process.env.REACT_APP_API_BASE_URL}/api/account?limit=3&for_dropdown=true&page=1`}
                    queryKey={["doctorList"]}
                  />
                </div>
                <div className="text-sm font-medium col-span-12 xs:col-span-5">
                  <InfiniteSelect
                    placeholder="Select Branch"
                    onChange={(e) => setBranchFilter(e)}
                    className="border-none"
                    api={`${process.env.REACT_APP_API_BASE_URL}/api/branch?limit=3&for_dropdown=true&page=1`}
                    queryKey={["branchList"]}
                  />
                </div>
              </div>
              <div className="flex flex-col flex-auto relative min-h-[70vh] xl:min-h-0">
                <div className="absolute top-0 inset-x-0 h-full w-full pt-4">
                  <div className="overflow-auto space-y-4 h-full w-full box-content p-4 -m-4">
                    {flattenScheduleList.length > 0 ? (
                      flattenScheduleList?.map(
                        (
                          {
                            branch_id,
                            branch_name,
                            clinic_room,
                            created_at,
                            date,
                            doctor_id,
                            doctor_name,
                            doctor_schedule_type,
                            end_time,
                            patient_id,
                            patient_name,
                            email,
                            mobile_number,
                            reason_for_visit,
                            schedule_type,
                            start_time,
                            updated_at,
                            _id,
                          },
                          index
                        ) => {
                          return (
                            <AnimateContainer key={_id} variants={fadeIn}>
                              <Card
                                className="text-base rounded-2xl overflow-hidden hover:[&_.card-overlay]:opacity-100"
                                innerRef={scheduleRef}
                              >
                                <div>
                                  <div className="flex items-center flex-wrap gap-6 xs:text-left xs:flex-nowrap text-center">
                                    <div className="relative w-16 h-16 bg-primary-50 text-primary font-medium text-2xl rounded-full flex flex-none justify-center items-center leading-[normal]">
                                      {patient_name.charAt(0)}
                                    </div>
                                    <div className="space-y-0 basis-full xs:basis-auto">
                                      <div className="font-bold text-xl">
                                        {patient_name}
                                      </div>
                                      <div>{email}</div>
                                      <div>{mobile_number}</div>
                                      <div className="flex items-center xs:justify-start justify-center gap-4">
                                        <div className="align-middle text-sm whitespace-nowrap">
                                          <AiOutlineCalendar className="inline-block align-middle" />{" "}
                                          <span>
                                            {format(
                                              parseISO(created_at),
                                              "dd/MM/yyyy"
                                            )}
                                          </span>
                                        </div>
                                        <div className="align-middle text-sm whitespace-nowrap">
                                          <AiOutlineClockCircle className="inline-block align-middle" />{" "}
                                          <span>
                                            {format(
                                              parseISO(created_at),
                                              "H:mm:ss"
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-0 font-medium basis-full xs:basis-auto">
                                      <div>{reason_for_visit}</div>
                                      <div>Dr. {doctor_name}</div>
                                      <div>
                                        {branch_name} - {clinic_room}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="transition absolute top-0 left-0 w-full h-full flex justify-center items-center text-3xl text-white bg-[#006669B3] opacity-0 card-overlay gap-6">
                                    <BsCameraVideo className="align-middle cursor-pointer hover:text-secondary transition" />
                                    <BsCheck2Square className="align-middle cursor-pointer hover:text-secondary transition" />
                                    <AiOutlineStop className="align-middle cursor-pointer hover:text-secondary transition" />
                                    <BsPencilSquare className="align-middle cursor-pointer hover:text-secondary transition" />
                                    <BsTrash className="align-middle cursor-pointer hover:text-secondary transition" />
                                  </div>
                                </div>
                              </Card>
                            </AnimateContainer>
                          );
                        }
                      )
                    ) : (
                      <AnimateContainer key="empty-patient" variants={fadeIn}>
                        <div className="text-4xl text-gray-400 text-center">
                          No Records
                        </div>
                      </AnimateContainer>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
      <AddScheduleModal
        show={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        className="w-[60rem]"
        id="schedule-modal"
        form={ScheduleForm}
        setIsPatientModalOpen={(isOpen: boolean) =>
          setIsPatientModalOpen(isOpen)
        }
      />
      <AddPatientModal
        show={isPatientModalOpen}
        isScheduleModalOpen={isScheduleModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        className="w-[80rem]"
        id="patient-modal"
        form={RegistrationForm}
        ScheduleForm={ScheduleForm}
      />
    </>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(Dashboard);
