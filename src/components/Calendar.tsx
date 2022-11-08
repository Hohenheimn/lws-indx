import { Menu, Transition } from "@headlessui/react";
// import { DotsVerticalIcon } from "@heroicons/react/outline";
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from "date-fns";
import { useState } from "react";
import { classNameMerge } from "../../utils/helpers";
import { AnimateContainer } from "./animation";
import { fadeIn } from "./animation/animation";

export default function Calendar() {
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  //   let selectedDayMeetings = meetings.filter((meeting) =>
  //     isSameDay(parseISO(meeting.startDatetime), selectedDay)
  //   );

  return (
    <div className="pt-16">
      <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
        <div className="flex items-center">
          <AnimateContainer
            key={currentMonth}
            variants={fadeIn}
            className="flex-auto font-semibold text-gray-900"
          >
            <h2 className="text-lg">
              {format(firstDayCurrentMonth, "MMMM yyyy")}
            </h2>
          </AnimateContainer>
          <div className="flex space-x-2 ">
            <button
              type="button"
              onClick={previousMonth}
              className="flex flex-none outline-none text-sm items-center justify-center text-gray-400 hover:text-primary-500 transition"
            >
              <span className="sr-only">Previous month</span>
              <div aria-hidden="true">Previous</div>
              {/* <ChevronLeftIcon  /> */}
            </button>
            <button
              onClick={nextMonth}
              type="button"
              className="flex flex-none outline-none text-sm items-center justify-center text-gray-400 hover:text-primary-500 transition"
            >
              <span className="sr-only">Next month</span>
              <div aria-hidden="true">Next</div>
              {/* <ChevronRightIcon className="w-5 h-5" aria-hidden="true" /> */}
            </button>
          </div>
        </div>
        <AnimateContainer key={currentMonth} variants={fadeIn}>
          <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>
          <div className="grid grid-cols-7 mt-2 text-sm">
            {days.map((day, dayIdx) => {
              return (
                <div
                  key={day.toString()}
                  className={classNameMerge(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    "py-1.5"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={classNameMerge(
                      isEqual(day, selectedDay) && "text-white",
                      !isEqual(day, selectedDay) &&
                        isToday(day) &&
                        "text-primary-500",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        "text-gray-900",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        "text-gray-400",
                      isEqual(day, selectedDay) &&
                        isToday(day) &&
                        "bg-primary-500",
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        "bg-primary-500",
                      !isEqual(day, selectedDay) && "hover:bg-gray-200",
                      (isEqual(day, selectedDay) || isToday(day)) &&
                        "font-semibold",
                      "mx-auto flex h-8 w-8 items-center justify-center rounded-full transition"
                    )}
                  >
                    <time
                      dateTime={format(day, "yyyy-MM-dd")}
                      className="leading-none"
                    >
                      {format(day, "d")}
                    </time>
                  </button>
                </div>
              );
            })}
          </div>
        </AnimateContainer>
      </div>
    </div>
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
