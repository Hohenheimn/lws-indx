import React from "react";
import { RadioGroup } from "@headlessui/react";
import { Button as Btn } from "./Button";
import { twMerge } from "tailwind-merge";
import { Radio as Rad } from "antd";

type RadioButtonProps = {
  label: string;
  value: string;
  className?: string;
};

interface RadioProps extends React.FC<RadioButtonProps> {
  Group: any;
  Button: typeof Button;
}

const Button: React.FC<RadioButtonProps> = ({ label, value, className }) => {
  return (
    <RadioGroup.Option value={value}>
      {({ checked }) => (
        <Btn
          className={twMerge(
            `font-normal border-default p-3`,
            `${
              checked
                ? "bg-primary-500 text-white font-medium"
                : "bg-transparent text-slate-500 hover:text-primary-500"
            }`,
            className
          )}
        >
          {label}
        </Btn>
      )}
    </RadioGroup.Option>
  );
};

export const Radio: RadioProps = ({ label, value, className }) => {
  return (
    <RadioGroup.Option value={value}>
      {({ checked }) => (
        <>
          <input
            type="radio"
            className={twMerge(
              "w-4 h-4 text-blue-600 bg-gray-100 border-default !outline-0 !ring-0",
              className
            )}
          />
          <label
            htmlFor={value}
            className="ml-2 text-sm font-medium text-gray-900 dark:text-casper-500"
          >
            {label}
          </label>
        </>
      )}
    </RadioGroup.Option>
  );
};

const Group = ({ children, className, ...rest }: any) => {
  function gridChecker(length: number) {
    switch (length) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-4";
      case 5:
        return "grid-cols-5";
      default:
        return "";
    }
  }
  return (
    <RadioGroup
      {...rest}
      className={twMerge(
        `grid ${gridChecker(
          children.length
        )} items-center justify-center [&_button]:rounded-none [&_button]:first:[&>div]:rounded-tl-md [&_button]:first:[&>div]:rounded-bl-md [&_button]:last:[&>div]:rounded-tr-md [&_button]:last:[&>div]:rounded-br-md w-full [&>div]:flex-auto`,
        className
      )}
    >
      {children}
    </RadioGroup>
  );
};

Radio.Group = Group;
Radio.Button = Button;
