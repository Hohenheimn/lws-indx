import React from "react";
import { PageContainer } from "../../../components/animation";
import PrivateRoute from "../../../auth/HOC/PrivateRoute";
import VerifyAuth from "../../../auth/HOC/VerifyAuth";
import Card from "../../../components/Card";
import Avatar from "../../../components/Avatar";
import { Button } from "../../../components/Button";
import Input from "../../../components/Input";
import { Select } from "../../../components/Select";
import { NextPageProps } from "../../../../utils/types/NextPageProps";

export function ApplicationSettings({}: NextPageProps) {
  return (
    <PageContainer>
      <div className="flex justify-between items-center gap-4">
        <h3 className="basis-auto whitespace-nowrap">Application Settings</h3>
      </div>
      <Card className="px-[5%] py-20 flex flex-col flex-auto justify-between gap-6">
        <div className="flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
          <div className="basis-full sm:basis-[35%] hidden sm:block">
            <h5>Clinic Logo</h5>
          </div>
          <div className="space-y-2 flex flex-col justify-center items-center basis-full sm:basis-[40%]">
            <Avatar className="h-24 w-24" />
            <Button appearance="link">Upload Clinic Logo</Button>
          </div>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
          <div className="basis-full sm:basis-[35%]">
            <h5>Value Added Tax (VAT) Default Percentage</h5>
          </div>
          <div className="space-y-2 flex flex-col justify-center items-center basis-full sm:basis-[40%]">
            <Input />
          </div>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
          <div className="basis-full sm:basis-[35%]">
            <h5>Dentist Chart Notation</h5>
          </div>
          <div className="space-y-2 flex flex-col justify-center items-center basis-full sm:basis-[40%]">
            <Select>
              <Select.Option value="ISO System" key="ISO System">
                ISO System
              </Select.Option>
              <Select.Option
                value="Universal Numbering System"
                key="Universal Numbering System"
              >
                Universal Numbering System
              </Select.Option>
            </Select>
          </div>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
          <div className="basis-full sm:basis-[35%] space-y-4">
            <h5>Email Appointment Reminder</h5>
            <div className="text-base">
              Sends Email reminder to patients who scheduled an appointment
            </div>
          </div>
          <div className="space-y-2 flex flex-col justify-center items-center basis-full sm:basis-[40%]">
            <Select>
              <Select.Option value="Enable" key="Enable">
                Enable
              </Select.Option>
              <Select.Option value="Disable" key="Disable">
                Disable
              </Select.Option>
            </Select>
          </div>
        </div>
        <div className="flex justify-between items-center gap-4 flex-wrap sm:flex-nowrap">
          <div className="basis-full sm:basis-[35%] space-y-4">
            <h5>Email Reminder Frequency</h5>
            <div className="text-base">
              How many day/s before sending the appointment reminder.
            </div>
          </div>
          <div className="space-y-2 flex flex-col justify-center items-center basis-full sm:basis-[40%]">
            <Select>
              <Select.Option value="1 Day Before" key="1 Day Before">
                1 Day Before
              </Select.Option>
              <Select.Option value="2 Days Before" key="2 Days Before">
                2 Days Before
              </Select.Option>
              <Select.Option value="3 Days Before" key="3 Days Before">
                3 Days Before
              </Select.Option>
              <Select.Option value="4 Days Before" key="4 Days Before">
                4 Days Before
              </Select.Option>
              <Select.Option value="5 Days Before" key="5 Days Before">
                5 Days Before
              </Select.Option>
              <Select.Option value="6 Days Before" key="6 Days Before">
                6 Days Before
              </Select.Option>
              <Select.Option value="7 Days Before" key="7 Days Before">
                7 Days Before
              </Select.Option>
              <Select.Option value="1 Month Before" key="1 Month Before">
                1 Month Before
              </Select.Option>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="flex-auto sm:max-w-[12rem]">
            <Button appearance="primary" className="p-3">
              Save
            </Button>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(ApplicationSettings);
