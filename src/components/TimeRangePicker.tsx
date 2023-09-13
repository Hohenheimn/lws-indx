import React, { use, useEffect, useRef, useState } from "react";
import {
  addMinutes,
  format,
  startOfDay,
  parse,
  differenceInMinutes,
  isValid,
  addHours,
} from "date-fns";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { scrollToTarget } from "@utilities/helpers";

import { fadeIn } from "./animation/animation";
import { Button } from "./Button";
import Input from "./Input";

type Props = {
  onChange: (value: string[]) => void;
  isTime: { start: string; end: string }[];
  id?: any;
  disabled?: boolean;
  blockOutSide?: string[];
  filterByOutSideTime?: boolean;
};

const convertTo24HourFormat = (time12Hour: string) => {
  const date = parse(time12Hour, "hh:mm a", new Date());
  return format(date, "HH:mm");
};

const convertToNumber = (time12Hour: string) => {
  const date = convertTo24HourFormat(time12Hour);
  return Number(date.replace(":", ""));
};

const getDatesBetween = (start: string, end: string) => {
  const times = [];
  let currentTime = parse(start, "hh:mm a", new Date());

  while (currentTime <= parse(end, "hh:mm a", new Date())) {
    times.push(format(currentTime, "hh:mm a"));
    currentTime = addMinutes(currentTime, 30);
  }

  return times;
};

const disabledTime = (
  type: string,
  isTime: { start: string; end: string }[],
  blockOutSide: string[]
) => {
  let disableHoursBySchedule: string[] = [];
  isTime.map((time) => {
    disableHoursBySchedule = [
      ...disableHoursBySchedule,
      ...getDatesBetween(time.start, time.end),
    ];
  });
  return [...disableHoursBySchedule, ...blockOutSide];
};

export default function TimeRangePicker({
  isTime,
  id,
  onChange,
  disabled,
  blockOutSide,
  filterByOutSideTime,
  ...rest
}: Props) {
  const disabledTimeArray = disabledTime(
    "",
    isTime,
    blockOutSide === undefined ? [] : blockOutSide
  );
  const [show, setShow] = useState(false);

  // time to be show, can be remove the outside time of the schedule
  let timeSlots = filterByOutSideTime
    ? generateTimeSlots().filter((item) => !blockOutSide?.includes(item))
    : generateTimeSlots();

  const restValue: any = rest;
  const [start, setStart] = useState(
    restValue?.value ? restValue.value[0] : ""
  );
  const [end, setEnd] = useState(restValue?.value ? restValue.value[1] : "");

  // close by clicking outside
  const Container = useRef<any>();
  useEffect(() => {
    const clickOutSide = (e: any) => {
      if (!Container.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", clickOutSide);
    return () => {
      document.removeEventListener("mousedown", clickOutSide);
    };
  });

  useEffect(() => {
    if (start === "") return;
    const selectedTime = parse(start, "hh:mm a", new Date());
    const oneHourLater = addHours(selectedTime, 1);
    if (isValid(oneHourLater)) {
      setEnd(format(oneHourLater, "hh:mm a"));
    } else {
      setEnd("");
    }
  }, [start]);

  useEffect(() => {
    scrollToTarget(endTimeScroll);
    scrollToTarget(startTimeScroll);
  }, [start, end]);

  const applyHandler = () => {
    const startNumber = convertToNumber(start);
    const endNumber = convertToNumber(end);
    if (startNumber > endNumber) {
      onChange([end, start]);
      setStart(end);
      setEnd(start);
    } else {
      onChange([start, end]);
    }
    setShow(false);
  };

  const startTimeScroll = useRef<any>(null);
  const endTimeScroll = useRef<any>(null);

  useEffect(() => {
    scrollToTarget(startTimeScroll);
    scrollToTarget(endTimeScroll);
  }, [show]);

  return (
    <div className=" flex gap-3 relative z-10" ref={Container}>
      <Input
        {...rest}
        disabled={disabled}
        id={id}
        placeholder="time"
        value={
          restValue?.value?.length > 0
            ? restValue?.value[0] +
              `${
                restValue?.value[0] === "" && restValue?.value[1] === ""
                  ? ""
                  : " - "
              }` +
              restValue?.value[1]
            : ""
        }
        onClick={() => setShow(true)}
      />
      <AnimatePresence>
        {show && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={fadeIn}
            className="w-full absolute top-[110%] grid grid-cols-2 gap-3 bg-white p-3 rounded-lg shadow-md"
          >
            <ul className=" bg-white rounded-md max-h-[15rem] overflow-auto border border-gray-300">
              <li className=" py-2 px-5 sticky top-0 bg-white shadow-sm">
                <p className=" font-bold text-primary-500">Start: {start}</p>
              </li>
              {timeSlots.map((time) => (
                <li
                  key={time}
                  id="start"
                  ref={start === time ? startTimeScroll : undefined}
                  className={`border-b cursor-pointer py-2 px-5 hover:bg-primary-500 hover:text-white duration-100 ${start ===
                    time &&
                    "bg-primary-500 text-white"} ${disabledTimeArray.includes(
                    time
                  ) && "pointer-events-none bg-gray-200 border-gray-300"}`}
                  onClick={() => {
                    if (end === time) return;
                    setStart(time);
                  }}
                >
                  {time}
                </li>
              ))}
            </ul>
            <ul className=" bg-white relative rounded-md shadow-md max-h-[15rem] overflow-auto border border-gray-300">
              <li className=" py-2 px-5 sticky top-0 bg-white shadow-sm">
                <p className=" font-bold text-primary-500">End {end}</p>
              </li>
              {timeSlots.map((time) => (
                <li
                  key={time}
                  id="end"
                  ref={end === time ? endTimeScroll : undefined}
                  className={`border-b cursor-pointer py-2 px-5 hover:bg-primary-500 hover:text-white duration-100 ${end ===
                    time &&
                    "bg-primary-500 text-white"} ${disabledTimeArray.includes(
                    time
                  ) && "pointer-events-none bg-gray-200 border-gray-300"}`}
                  onClick={() => {
                    if (time === start) return;
                    setEnd(time);
                  }}
                >
                  {time}
                </li>
              ))}
            </ul>
            <div></div>
            <div className=" flex justify-end">
              <Button
                appearance="primary"
                onClick={applyHandler}
                className=" p-1"
              >
                APPLY
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function generateTimeSlots() {
  // 480; // 8:00 AM in minutes (8 * 60)
  // 1440; // 6:00 PM in minutes (24 * 60)
  // 30; // 30 minutes
  const timeSlots = [];
  let currentDate: any = startOfDay(new Date());
  while (currentDate < addMinutes(startOfDay(new Date()), 1440)) {
    timeSlots.push(format(currentDate, "hh:mm a"));
    currentDate = addMinutes(currentDate, 30);
  }
  return timeSlots;
}
