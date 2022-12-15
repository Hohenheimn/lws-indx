import React from "react";
import { AnimateContainer, PageContainer } from "../components/animation";
import Form from "antd/lib/form";
import Input from "../components/Input";
import { Button } from "../components/Button";
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
import Calendar from "../components/Calendar";
import { Select } from "../components/Select";
import Card from "../components/Card";
import { isEqual, isBefore, isAfter, parse, format } from "date-fns";
import { fadeIn } from "../components/animation/animation";
import Modal from "../components/Modal";
import { PatternFormat } from "react-number-format";
import { scroller } from "react-scroll";
import fakeDoctors from "../../utils/global-data/fakeDoctors";
import fakeBranches from "../../utils/global-data/fakeBranches";
import PrivateRoute from "../auth/HOC/PrivateRoute";
import VerifyAuth from "../auth/HOC/VerifyAuth";
import { NextPageProps } from "../../utils/types/NextPageProps";
import { NextApiRequest } from "next";

const fakePatients = [
  {
    name: "Marquise Finney",
    email: "marquise@gmail.com",
    mobile_number: "09xx-xxx-xxxx",
    issue: "Tooth Ache",
    doctor: "Marc Medina",
    branch: "Cavite",
    unit: "Room 100",
    schedule: parse("11/22/2022", "MM/dd/yyyy", new Date()),
  },
  {
    name: "Darien Guy",
    email: "darien@gmail.com",
    mobile_number: "09xx-xxx-xxxx",
    issue: "Braces",
    doctor: "Bianca Medina",
    branch: "Quezon City",
    unit: "Room 854",
    schedule: parse("11/15/2022", "MM/dd/yyyy", new Date()),
  },
  {
    name: "Leticia Coffin",
    email: "leticia@gmail.com",
    mobile_number: "09xx-xxx-xxxx",
    issue: "Whitening",
    doctor: "Marcus Medina",
    branch: "Quezon City",
    unit: "Room 143",
    schedule: parse("11/13/2022", "MM/dd/yyyy", new Date()),
  },
  {
    name: "Denver Hardman",
    email: "denver@gmail.com",
    mobile_number: "09xx-xxx-xxxx",
    issue: "Tooth Ache",
    doctor: "Beatrice Medina",
    branch: "Quezon City",
    unit: "Room 542",
    schedule: parse("11/08/2022", "MM/dd/yyyy", new Date()),
  },
  {
    name: "Arman Whiting",
    email: "arman@gmail.com",
    mobile_number: "09xx-xxx-xxxx",
    issue: "Bunot",
    doctor: "Marco Medina",
    branch: "Manila",
    unit: "Room 732",
    schedule: parse("11/25/2022", "MM/dd/yyyy", new Date()),
  },
  {
    name: "Francisco Coffey",
    email: "francisco@gmail.com",
    mobile_number: "09xx-xxx-xxxx",
    issue: "Braces",
    doctor: "Brylle Medina",
    branch: "Makati",
    unit: "Room 696",
    schedule: parse("11/28/2022", "MM/dd/yyyy", new Date()),
  },
];

export function Dashboard({}: NextPageProps) {
  let [selectedDate, setSelectedDate] = React.useState({
    dateStart: new Date(),
    dateEnd: new Date(),
  });
  let [doctorFilter, setDoctorFilter] = React.useState("");
  let [branchFilter, setBranchFilter] = React.useState("");
  let [showScheduleModal, setShowScheduleModal] = React.useState(false);
  const [RegistrationForm] = Form.useForm();

  const filteredPatients = fakePatients.filter((patient) => {
    if (!isEqual(selectedDate.dateEnd, selectedDate.dateStart)) {
      return (
        (((patient.doctor.toLowerCase().includes(doctorFilter.toLowerCase()) &&
          patient.branch.toLowerCase().includes(branchFilter.toLowerCase()) &&
          isBefore(selectedDate.dateStart, patient.schedule)) ||
          isEqual(selectedDate.dateStart, patient.schedule)) &&
          isAfter(selectedDate.dateEnd, patient.schedule)) ||
        isEqual(selectedDate.dateEnd, patient.schedule)
      );
    } else
      return (
        patient.doctor.toLowerCase().includes(doctorFilter.toLowerCase()) &&
        patient.branch.toLowerCase().includes(branchFilter.toLowerCase())
      );
  });

  return (
    <>
      <PageContainer>
        <h3>Dashboard</h3>
        <div className="flex justify-between items-center gap-4 flex-wrap lg:flex-nowrap">
          <div className="basis-full lg:basis-1/2">
            <Input
              placeholder="Search"
              prefix={<AiOutlineSearch className="text-lg text-gray-300" />}
              className="rounded-full border-none text-lg"
            />
          </div>
          <div className="basis-full lg:basis-auto flex-wrap xs:flex-nowrap flex gap-4">
            <Button
              className="p-3 w-full"
              onClick={() => setShowScheduleModal(true)}
              appearance="primary"
            >
              <div className="flex justify-center items-center">
                <IoIosAdd className="inline-block text-2xl" />{" "}
                <span>Add New Schedule</span>
              </div>
            </Button>
            <Button className="p-3 w-full" appearance="primary">
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
                <div className="text-sm text-gray-500 font-medium col-span-12 xs:col-span-2">
                  FILTER BY:
                </div>
                <div className="text-sm text-gray-500 font-medium col-span-12 xs:col-span-5">
                  <Select
                    placeholder="Select Doctor"
                    onChange={(value: string) => setDoctorFilter(value)}
                    className="border-none"
                  >
                    {fakeDoctors.map(({ name }, index) => {
                      return (
                        <Select.Option value={name} key={index}>
                          {name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </div>
                <div className="text-sm text-gray-500 font-medium col-span-12 xs:col-span-5">
                  <Select
                    placeholder="Select Branch"
                    onChange={(value: string) => setBranchFilter(value)}
                    className="border-none"
                  >
                    {fakeBranches.map(({ name }, index) => {
                      return (
                        <Select.Option value={name} key={index}>
                          {name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </div>
              </div>
              <div className="flex flex-col flex-auto relative min-h-[70vh] xl:min-h-0">
                <div className="absolute top-0 inset-x-0 h-full w-full pt-4">
                  <div className="overflow-auto space-y-4 h-full w-full box-content p-4 -m-4">
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map(
                        (
                          {
                            name,
                            email,
                            mobile_number,
                            doctor,
                            issue,
                            branch,
                            unit,
                            schedule,
                          },
                          index
                        ) => {
                          return (
                            <AnimateContainer key={name} variants={fadeIn}>
                              <Card className="text-base rounded-2xl overflow-hidden hover:[&_.card-overlay]:opacity-100">
                                <div>
                                  <div className="flex items-center flex-wrap gap-6 xs:text-left xs:flex-nowrap text-center">
                                    <div className="relative w-16 h-16 bg-primary-50 text-primary font-medium text-2xl rounded-full flex basis-full xs:basis-auto justify-center items-center leading-[normal]">
                                      {name.charAt(0)}
                                    </div>
                                    <div className="space-y-0 basis-full xs:basis-auto">
                                      <div className="font-bold text-xl">
                                        {name}
                                      </div>
                                      <div>{email}</div>
                                      <div>{mobile_number}</div>
                                      <div className="flex items-center xs:justify-start justify-center gap-4">
                                        <div className="align-middle text-sm whitespace-nowrap">
                                          <AiOutlineCalendar className="inline-block align-middle" />{" "}
                                          <span>
                                            {format(schedule, "MM/dd/yyyy")}
                                          </span>
                                        </div>
                                        <div className="align-middle text-sm whitespace-nowrap">
                                          <AiOutlineClockCircle className="inline-block align-middle" />{" "}
                                          <span>15.00hs</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-0 font-medium basis-full xs:basis-auto">
                                      <div>{issue}</div>
                                      <div>Dr. {doctor}</div>
                                      <div>
                                        {branch} - {unit}
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
      <Modal
        show={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        className="w-[60rem]"
        id="schedule-modal"
      >
        <div className="space-y-8">
          <div className="font-semibold text-3xl">Add New Schedule</div>
          <Form
            form={RegistrationForm}
            layout="vertical"
            onFinish={(values) => {
              console.log(values);
            }}
            onFinishFailed={(data) => {
              scroller.scrollTo(data?.errorFields[0]?.name[0].toString(), {
                smooth: true,
                offset: -50,
                containerId: "schedule-modal",
              });
            }}
          >
            <Form.Item
              label="Type of Schedule"
              name="type_of_schedule"
              rules={[{ required: true, message: "This is required!" }]}
              required={false}
            >
              <Select placeholder="Patient Schedule" id="type_of_schedule">
                {fakeBranches.map(({ name }, index) => {
                  return (
                    <Select.Option value={name} key={index}>
                      {name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="First Name"
              name="first_name"
              rules={[{ required: true, message: "This is required!" }]}
              required={false}
            >
              <Input id="first_name" placeholder="Juan" />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="last_name"
              rules={[{ required: true, message: "This is required!" }]}
              required={false}
            >
              <Input id="last_name" placeholder="Dela Cruz" />
            </Form.Item>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "This is required!" },
                { type: "email", message: "Must be a valid email" },
              ]}
              required={false}
            >
              <Input id="email" placeholder="juandelacruz@xxxxx.xxx" />
            </Form.Item>
            <Form.Item
              label="Mobile Number"
              name="mobile_number"
              rules={[
                { required: true, message: "This is required!" },
                {
                  pattern: /^(09)\d{2}-\d{3}-\d{4}$/,
                  message: "Please use correct format!",
                },
              ]}
              required={false}
            >
              <PatternFormat
                customInput={Input}
                placeholder="09XX-XXX-XXXXX"
                mask="X"
                format="####-###-####"
                allowEmptyFormatting={false}
                id="mobile_number"
              />
            </Form.Item>
            <Form.Item
              label="Reason for Visit"
              name="reason_for_visit"
              rules={[{ required: true, message: "This is required!" }]}
              required={false}
            >
              <Select
                placeholder="Select Reason for Visit"
                id="reason_for_visit"
              >
                {fakeBranches.map(({ name }, index) => {
                  return (
                    <Select.Option value={name} key={index}>
                      {name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Doctor"
              name="doctor"
              rules={[{ required: true, message: "This is required!" }]}
              required={false}
            >
              <Select placeholder="Select Doctor" id="doctor">
                {fakeBranches.map(({ name }, index) => {
                  return (
                    <Select.Option value={name} key={index}>
                      {name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Branch"
              name="branch"
              rules={[{ required: true, message: "This is required!" }]}
              required={false}
            >
              <Select placeholder="Select Branch" id="branch">
                {fakeBranches.map(({ name }, index) => {
                  return (
                    <Select.Option value={name} key={index}>
                      {name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label="Room"
              name="room"
              rules={[{ required: true, message: "This is required!" }]}
              required={false}
            >
              <Select placeholder="Select Room" id="room">
                {fakeBranches.map(({ name }, index) => {
                  return (
                    <Select.Option value={name} key={index}>
                      {name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <div className="flex justify-end items-center gap-4">
              <Button
                appearance="link"
                className="p-4 bg-transparent border-none text-gray-500 font-semibold"
                onClick={() => setShowScheduleModal(false)}
              >
                Cancel
              </Button>
              <Button
                appearance="primary"
                className="max-w-[10rem]"
                type="submit"
              >
                Save
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(Dashboard);
