import React from "react";
import { PageContainer } from "../../components/animation";
import { Button } from "../../components/Button";
import {
  BsCameraVideo,
  BsBoxArrowUpRight,
  BsPrinter,
  BsTrash,
} from "react-icons/bs";
import { AiOutlineCalendar } from "react-icons/ai";
import Image from "next/image";
import PrivateRoute from "../../auth/HOC/PrivateRoute";
import VerifyAuth from "../../auth/HOC/VerifyAuth";
import { NextPageProps } from "../../../utils/types/NextPageProps";
import Card from "../../components/Card";
import Avatar from "../../components/Avatar";
import { Tabs } from "antd";
import patientRecord from "../../page-components/patient-record";

interface PatientRecordProps extends NextPageProps {
  selectedPatientID: number;
}

let fakeData = [
  {
    id: 0,
    first_name: "Kaley",
    last_name: "Cuoco",
    email_address: "caley@gmail.com",
    mobile_number: "0995-732-1015",
  },
  {
    id: 1,
    first_name: "Kaley1",
    last_name: "Cuoco1",
    email_address: "caley1@gmail.com",
    mobile_number: "0995-732-1016",
  },
  {
    id: 2,
    first_name: "Kaley2",
    last_name: "Cuoco2",
    email_address: "caley2@gmail.com",
    mobile_number: "0995-732-1017",
  },
  {
    id: 3,
    first_name: "Kaley3",
    last_name: "Cuoco3",
    email_address: "caley@gmail.com",
    mobile_number: "0995-732-1018",
  },
  {
    id: 4,
    first_name: "Kaley4",
    last_name: "Cuoco4",
    email_address: "caley@gmail.com",
    mobile_number: "0995-732-1019",
  },
];

export function PatientRecord({
  router,
  selectedPatientID,
}: PatientRecordProps) {
  let selectedPatient = fakeData.find(({ id }) => id === selectedPatientID);

  return (
    <>
      <PageContainer id="patient-record-container">
        <h3>Patient Record</h3>
        <Card className="text-base">
          <div className="grid grid-cols-1 lg:grid-cols-[30%_1fr] items-center gap-8">
            <div className="flex flex-col justify-center items-center gap-4">
              <Avatar>
                <Image
                  src="https://picsum.photos/500/500"
                  alt="random pics"
                  fill
                  sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                  className="object-center rounded-full"
                />
              </Avatar>
              <h5>
                {selectedPatient?.first_name} {selectedPatient?.last_name}
              </h5>
              <div className="flex justify-center items-center gap-3">
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
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] xs:gap-4">
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-[auto_1fr] xs:gap-4">
                <div className="after:content-none xs:after:content-[':'] after:pl-2 xs:after:float-right text-gray-400 xs:max-lg:text-right lg:text-left text-center">
                  Patient No
                </div>
                <div className="xs:text-left text-center xs:mb-0 mb-4">
                  0009593858
                </div>
                <div className="after:content-none xs:after:content-[':'] after:pl-2 xs:after:float-right text-gray-400 xs:max-lg:text-right lg:text-left text-center">
                  Age
                </div>
                <div className="xs:text-left text-center xs:mb-0 mb-4">
                  35 Years Old
                </div>
                <div className="after:content-none xs:after:content-[':'] after:pl-2 xs:after:float-right text-gray-400 xs:max-lg:text-right lg:text-left text-center">
                  Gender
                </div>
                <div className="xs:text-left text-center xs:mb-0 mb-4">
                  Female
                </div>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-[auto_1fr] xs:gap-4">
                <div className="after:content-none xs:after:content-[':'] after:pl-2 xs:after:float-right text-gray-400 xs:max-lg:text-right lg:text-left text-center">
                  Mobile Number
                </div>
                <div className="xs:text-left text-center xs:mb-0 mb-4">
                  09957325483
                </div>
                <div className="after:content-none xs:after:content-[':'] after:pl-2 xs:after:float-right text-gray-400 xs:max-lg:text-right lg:text-left text-center">
                  Email Address
                </div>
                <div className="xs:text-left text-center xs:mb-0 mb-4">
                  AlexGonzaga@gmail.com
                </div>
                <div className="after:content-none xs:after:content-[':'] after:pl-2 xs:after:float-right text-gray-400 xs:max-lg:text-right lg:text-left text-center">
                  Record Last Updated
                </div>
                <div className="xs:text-left text-center xs:mb-0 mb-4">
                  10/22/2021
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Tabs
          defaultActiveKey="1"
          onChange={() => console.log("asdf")}
          items={patientRecord}
        />
      </PageContainer>
    </>
  );
}

export const getServerSideProps = VerifyAuth((ctx, profile, openMenus) => {
  let selectedPatientID = Number(ctx.query.patientID);

  return { props: { profile, openMenus, selectedPatientID } };
});
export default PrivateRoute(PatientRecord);
