import React, { useEffect } from "react";
import {
  add,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfMonth,
  format,
  getDay,
  getDate,
  getYear,
  isEqual,
  isToday,
  isBefore,
  isAfter,
  parse,
  startOfMonth,
} from "date-fns";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import { PageContainer } from "@components/animation";
import { Button } from "@components/Button";
import Modal from "@components/Modal";

function getMonth(date: number | Date) {
  return format(date, "MMMM");
}

interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  onChange?: any;
  ScheduledDates: string[];
}

export default function Calendar({ onChange, ScheduledDates }: CalendarProps) {
  const ScheduledDatesFNS = ScheduledDates.map((date: string) =>
    parse(date, "yyyy-dd-MM", new Date())
  );
  let today = new Date();
  let [monthModalIsOpen, setMonthModalIsOpen] = React.useState(false);
  let [yearModalIsOpen, setYearModalIsOpen] = React.useState(false);
  let [selectedDay, setSelectedDay] = React.useState(getDate(today));
  let [selectedMonth, setSelectedMonth] = React.useState(getMonth(today));
  let [selectedYear, setSelectedYear] = React.useState(getYear(today));
  let [selectedDate, setSelectedDate] = React.useState(today);
  useEffect(() => {
    let parsedDate = parse(
      `${selectedMonth} ${selectedDay} ${selectedYear}`,
      "MMMM dd yyyy",
      new Date()
    );

    setSelectedDate(parsedDate);
  }, [selectedDay, selectedMonth, selectedYear]);

  let days = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate),
  });

  let months = eachMonthOfInterval({
    start: new Date(selectedYear, 0, 1),
    end: new Date(selectedYear, 11, 1),
  });

  let years = eachYearOfInterval({
    start: add(startOfMonth(selectedDate), { years: -4 }),
    end: add(startOfMonth(selectedDate), { years: 4 }),
  });

  function calendarNavigation(
    nav: number,
    format: "days" | "months" | "years"
  ) {
    let navigate = add(selectedDate, { [format]: nav });
    setSelectedDate(navigate);
  }

  return (
    <>
      <div className="flex w-full h-auto bg-white shadow-lg rounded-3xl p-8 items-center justify-center ">
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between">
            <BsArrowLeft
              className="transition text-4xl p-2 rounded-lg bg-transparent text-casper-500 hover:text-primary-500 cursor-pointer hover:bg-gray-50"
              onClick={() => calendarNavigation(-1, "months")}
            />
            <div className="text-casper-500 text-center uppercase text-base font-medium">
              <div
                onClick={() => setMonthModalIsOpen(true)}
                className="cursor-pointer transition hover:text-primary-500"
              >
                {format(selectedDate, "MMMM")}{" "}
              </div>
              <div
                className="cursor-pointer transition hover:text-primary-500"
                onClick={() => setYearModalIsOpen(true)}
              >
                {format(selectedDate, "yyyy")}
              </div>
            </div>
            <BsArrowRight
              className="transition text-4xl p-2 rounded-lg bg-transparent text-casper-500 hover:text-primary-500 cursor-pointer hover:bg-gray-50"
              onClick={() => calendarNavigation(1, "months")}
            />
          </div>
          <div className="grid grid-cols-7 mt-7 leading-6 text-center text-slate-400 text-lg font-semibold">
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
          </div>
          <div className="grid grid-cols-7 gap-3 mt-2 text-sm space-x-1 space-y-1 ">
            {days.map((day, dayIdx) => {
              return (
                <div
                  key={day.toString()}
                  className={`${twMerge(
                    " border border-transparent rounded-full hover:bg-primary-50 transition flex justify-center items-center h-[100%] aspect-square font-medium",
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    isToday(day) &&
                      "[&>.date-wrapper]:text-secondary-500 font-bold",
                    isToday(day) && !selectedDate && "date-today",
                    isEqual(selectedDate, day) && "date-in-range-first"
                  )}
                  ${ScheduledDates.includes(format(day, "yyyy-MM-dd")) &&
                    "bg-primary-50 shadow-2xl"}
                  `}
                >
                  <div
                    className={twMerge(
                      "transition duration-100 h-full w-full bg-transparent rounded-full text-slate-400 date-wrapper"
                    )}
                  >
                    <button
                      type="button"
                      className={twMerge(
                        "mx-auto flex h-full w-full items-center justify-center rounded-full transition"
                      )}
                      onClick={() => {
                        setSelectedDate(day);
                        onChange(day);
                      }}
                    >
                      <time
                        dateTime={format(day, "yyyy-MM-dd")}
                        className="leading-none"
                      >
                        {format(day, "d")}
                      </time>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {/* <Button
              onClick={() => {
                setSelectedDateStart(today);
                setSelectedDateEnd(today);
              }}
            >
              Clear
            </Button> */}
        </div>
      </div>
      <Modal show={monthModalIsOpen} onClose={setMonthModalIsOpen}>
        <div className="bg-white text-center grid grid-cols-1 md:grid-cols-3 gap-5">
          {months.map((month, index) => {
            return (
              <div
                key={index}
                className={twMerge(
                  "transition hover:text-primary cursor-pointer bg-transparent rounded-lg p-2 uppercase",
                  getMonth(month) === selectedMonth &&
                    "text-primary font-semibold"
                )}
                onClick={() => {
                  setSelectedMonth(getMonth(month));
                  setMonthModalIsOpen(false);
                }}
              >
                {format(month, "MMM")}
              </div>
            );
          })}
        </div>
      </Modal>
      <Modal
        show={yearModalIsOpen}
        onClose={setYearModalIsOpen}
        className="p-0"
      >
        <div className="bg-white py-[5%] space-y-6 text-center">
          <div className="grid grid-cols-3 gap-5 border-b border-b-slate-300 pb-4 justify-items-center items-center">
            <BsArrowLeft
              className="transition text-4xl p-2 rounded-lg bg-transparent text-casper-500 hover:text-primary-500 cursor-pointer hover:bg-gray-50"
              onClick={() => calendarNavigation(-1, "months")}
            />
            <div className="font-bold">2020 - 2030</div>
            <BsArrowRight
              className="transition text-4xl p-2 rounded-lg bg-transparent text-casper-500 hover:text-primary-500 cursor-pointer hover:bg-gray-50"
              onClick={() => calendarNavigation(1, "months")}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {years.map((year, index) => {
              return (
                <div
                  key={index}
                  className={twMerge(
                    "transition hover:text-primary cursor-pointer bg-transparent rounded-lg uppercase",
                    getYear(year) === selectedYear &&
                      "text-primary font-semibold"
                  )}
                  onClick={() => {
                    setSelectedYear(getYear(year));
                    setYearModalIsOpen(false);
                  }}
                >
                  {getYear(year)}
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </>
  );
}

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
