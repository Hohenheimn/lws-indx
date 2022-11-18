import React, { useEffect } from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  getDate,
  getYear,
  isEqual,
  isSameMonth,
  isToday,
  isBefore,
  isAfter,
  parse,
  parseISO,
  startOfMonth,
} from "date-fns";
import { PageContainer } from "../components/animation";
import { twMerge } from "tailwind-merge";
import { Button } from "../components/Button";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Dialog, Transition } from "@headlessui/react";
interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean;
  onClose: (value: boolean) => void;
}

export default function Modal({
  show,
  onClose,
  children,
  className,
  ...rest
}: ModalProps) {
  return (
    <Transition.Root show={show} as={"div"}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={"div"}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-10" {...rest}>
          <div className="flex min-h-full items-center justify-center sm:items-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={twMerge(
                  "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all min-w-[40rem] max-w-[100rem] p-12",
                  className
                )}
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
