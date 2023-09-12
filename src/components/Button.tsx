import React from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  variant?: string;
  appearance?:
    | "primary"
    | "secondary"
    | "danger"
    | "link"
    | "disabled"
    | string;
};

function appearanceChecker(
  appearance?: "primary" | "secondary" | "danger" | "link" | "disabled" | string
) {
  switch (appearance) {
    case "primary":
      return "bg-primary-500 border-primary-500 hover:bg-primary-600 hover:shadow-lg active:bg-primary-700 active:shadow-lg text-white";
    case "secondary":
      return "bg-secondary-500 border-secondary-500 hover:bg-secondary-600 hover:shadow-lg active:bg-secondary-700 active:shadow-lg text-white";
    case "blumine":
      return "bg-blumine-500 border-blumine-500 hover:bg-blumine-600 hover:shadow-lg active:bg-blumine-700 active:shadow-lg text-white";
    case "danger":
      return "bg-danger-500 border-danger-500 hover:bg-danger-600 hover:shadow-lg active:bg-danger-700 active:shadow-lg text-white";
    case "link":
      return "bg-transparent shadow-none text-default-text w-auto p-0 m-0 border-none tracking-normal hover:text-primary-500 overflow-visible";
    case "disabled":
      return "cursor-not-allowed bg-gray-300 border-transparent";
    default:
      return "";
  }
}

export const Button = ({
  children,
  className = "",
  type = "button",
  variant,
  appearance,
  ...rest
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={twMerge(
        "tracking-wider w-full border border-solid text-default-text font-normal px-3 lg:px-8 py-2 text-[.8rem] lg:text-base rounded-md shadow-md transition duration-300 ease-in-out relative",
        appearanceChecker(appearance),
        className
      )}
      disabled={appearance === "disabled"}
      data-ping={
        appearance === "link"
          ? "link"
          : appearance === "disabled"
          ? ""
          : "normal"
      }
      data-ping-type={appearance !== "disabled" ? appearance : ""}
      {...rest}
    >
      <div className="whitespace-nowrap text-ellipsis overflow-hidden">
        {children}
      </div>
    </button>
  );
};
