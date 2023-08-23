import React, { useEffect } from "react";
import { Calendar, Radio } from "antd";
import { parse } from "date-fns";
import moment from "moment";
import CalendarTypeIcons from "@src/components/CalendarTypeIcons";
import { Select } from "@src/components/Select";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@utilities/api";

type Props = {
  isCalendarType: string;
  setCalendarType: Function;
};

export default function AdvanceCalendar({
  isCalendarType,
  setCalendarType,
}: Props) {
  const dateToday = new Date();
  let { data: schedules } = useQuery(["schedule-dates"], () =>
    fetchData({
      url: `/api/schedule`,
    })
  );

  const dateCellRender = (day: any) => {
    const formattedDay = moment(day).format("yyyy-MM-DD");
    const getSchedule = schedules?.filter(
      (filterItem: any) => filterItem.date === formattedDay
    );
    return (
      <ul className=" space-y-[2px]">
        {getSchedule?.map((item: any, index: number) => (
          <li key={index} className=" bg-primary-500 text-white p-[2px]">
            {item.patient_name}
          </li>
        ))}
      </ul>
    );
  };

  const monthCellRender = (month: any) => {
    const formattedMonth = moment(month).format("MM");
    const getSchedule = schedules?.filter((filterItem: any) => {
      const dateType = parse(filterItem.date, "yyyy-MM-dd", new Date());
      if (moment(dateType).format("MM") === formattedMonth) {
        return filterItem;
      }
    });
    return (
      <ul className=" space-y-[2px]">
        {getSchedule?.map((item: any, index: number) => (
          <li key={index} className=" bg-primary-500 text-white p-[2px]">
            {item.patient_name}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="dashboard-advance-calendar">
      <CalendarTypeIcons
        isCalendarType={isCalendarType}
        setCalendarType={setCalendarType}
      />
      <div className=" overflow-auto w-full">
        <div className=" min-w-[850px]">
          <Calendar
            dateCellRender={dateCellRender}
            monthCellRender={monthCellRender}
            headerRender={({ value, type, onChange, onTypeChange }) => {
              const start = 0;
              const end = 12;
              const monthOptions: string[] = [];
              let current = value.clone();
              const localeData = value.localeData();
              const months = [];
              for (let i = 0; i < 12; i++) {
                current = current.month(i);
                months.push(localeData.monthsShort(current));
              }

              for (let i = start; i < end; i++) {
                monthOptions.push(months[i]);
              }

              const year =
                value.year() === 0
                  ? Number(moment(dateToday).format("yyyy"))
                  : value.year();
              const month = localeData.monthsShort(value.month("MM"));
              const options: number[] = [];
              for (let i = year - 10; i < year + 10; i += 1) {
                options.push(i);
              }

              return (
                <div className=" mb-5">
                  <ul className=" flex justify-between items-center">
                    <li className=" flex flex-wrap flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-2">
                      <div>
                        <Select
                          hideResetField={true}
                          onChange={(newYear: number) => {
                            const now = value.clone().year(newYear);
                            onChange(now);
                          }}
                          noFilter={true}
                          value={year}
                        >
                          {options.map((item: number, index: number) => (
                            <Select.Option key={index} value={item}>
                              {item}
                            </Select.Option>
                          ))}
                        </Select>
                      </div>

                      <div>
                        <Select
                          hideResetField={true}
                          onChange={(newMonth: string | number) => {
                            const now = value.clone().month(newMonth);
                            onChange(now);
                          }}
                          noFilter={true}
                          value={month}
                        >
                          {monthOptions.map((item: string, index: number) => (
                            <Select.Option key={index} value={item}>
                              {item}
                            </Select.Option>
                          ))}
                        </Select>
                      </div>
                    </li>
                    <li>
                      <Radio.Group
                        onChange={(e) => onTypeChange(e.target.value)}
                        value={type}
                        className=" rounded-md shadow-md overflow-hidden border-none"
                      >
                        <Radio.Button value="month">
                          <div className=" px-2 py-1">Month</div>
                        </Radio.Button>

                        <Radio.Button value="year">
                          <div className=" px-2 py-1">Year</div>
                        </Radio.Button>
                      </Radio.Group>
                    </li>
                  </ul>
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
