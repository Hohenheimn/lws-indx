import React from "react";
import { Calendar } from "antd";
import moment from "moment";
import CalendarTypeIcons from "@src/components/CalendarTypeIcons";

type Props = {
  isCalendarType: string;
  setCalendarType: Function;
};

export default function AdvanceCalendar({
  isCalendarType,
  setCalendarType,
}: Props) {
  const dateCellRender = (day: any) => {
    return (
      <ul className=" space-y-[2px]">
        <li className=" bg-primary-500 text-white p-[2px]">sample schedule</li>
        <li className=" bg-primary-500 text-white p-[2px]">sample schedule</li>
        <li className=" bg-primary-500 text-white p-[2px]">sample schedule</li>
        <li className=" bg-primary-500 text-white p-[2px]">sample schedule</li>
        <li className=" bg-primary-500 text-white p-[2px]">sample schedule</li>
      </ul>
    );
  };

  const monthCellRender = (month: any) => {
    return (
      <ul className=" space-y-[2px]">
        <li className=" bg-primary-500 text-white p-[2px]">sample month</li>
        <li className=" bg-primary-500 text-white p-[2px]">sample month</li>
        <li className=" bg-primary-500 text-white p-[2px]">sample month</li>
        <li className=" bg-primary-500 text-white p-[2px]">sample month</li>
        <li className=" bg-primary-500 text-white p-[2px]">sample month</li>
      </ul>
    );
  };
  const headerRender = (
    value: any,
    type: string,
    onChange: any,
    onTypeChange: any
  ) => {
    return <div>asdasds</div>;
  };
  return (
    <div className="dashboard-advance-calendar">
      <CalendarTypeIcons
        isCalendarType={isCalendarType}
        setCalendarType={setCalendarType}
      />
      <Calendar
        dateCellRender={dateCellRender}
        monthCellRender={monthCellRender}
        headerRender={headerRender}
      />
    </div>
  );
}
