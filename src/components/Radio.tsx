import React from "react";
import { RadioGroup } from "@headlessui/react";
import { Button as Btn } from "./Button";
import { twMerge } from "tailwind-merge";

type RadioButtonProps = {
  label: string;
  value: string;
  className?: string;
};

interface RadioProps
  extends React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> {
  Group: any;
  Button: typeof Button;
}

const Button: React.FC<RadioButtonProps> = ({ label, value, className }) => {
  return (
    <RadioGroup.Option value={value}>
      {({ checked }) => (
        <Btn
          className={twMerge(
            `font-normal border-slate-300 p-3`,
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

export const Radio: RadioProps = ({
  children,
  className = "",
  disabled,
  ...rest
}) => {
  return (
    <div></div>
    // <RadioGroup
    //   onChange={(e: string) => console.log(e)}
    //   className="flex items-center justify-center [&_button]:rounded-none [&_button]:first:[&>div]:rounded-tl-md [&_button]:first:[&>div]:rounded-bl-md [&_button]:last:[&>div]:rounded-tr-md [&_button]:last:[&>div]:rounded-br-md"
    // >
    //   <RadioGroup.Option value="startup">
    //     {({ checked }) => (
    //       <Button
    //         className={`
    //                   ${
    //                     checked
    //                       ? "bg-primary-500"
    //                       : "bg-transparent text-default-text hover:text-white border border-solid border-primary-500"
    //                   }
    //                     `}
    //       >
    //         Daily
    //       </Button>
    //     )}
    //   </RadioGroup.Option>
    //   <RadioGroup.Option value="business">
    //     {({ checked }) => (
    //       <Button
    //         className={`${
    //           checked
    //             ? "bg-primary-500"
    //             : "bg-transparent text-default-text hover:text-white border border-solid border-primary-500"
    //         }`}
    //       >
    //         Monthly
    //       </Button>
    //     )}
    //   </RadioGroup.Option>
    //   <RadioGroup.Option value="enterprise">
    //     {({ checked }) => (
    //       <Button
    //         className={`${
    //           checked
    //             ? "bg-primary-500"
    //             : "bg-transparent text-default-text hover:text-white border border-solid border-primary-500"
    //         }`}
    //       >
    //         Yearly
    //       </Button>
    //     )}
    //   </RadioGroup.Option>
    // </RadioGroup>
  );
};

Radio.Group = Group;
Radio.Button = Button;
