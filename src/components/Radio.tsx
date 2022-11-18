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
  Group: typeof RadioGroup;
  Button: typeof Button;
}

const Button: React.FC<RadioButtonProps> = ({ label, value, className }) => {
  return (
    <RadioGroup.Option value={value}>
      {({ checked }) => (
        <Btn
          className={twMerge(
            `${
              checked
                ? "bg-primary-500"
                : "bg-transparent text-default-text hover:text-white border border-solid border-slate-200"
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

Radio.Group = RadioGroup;
Radio.Button = Button;
