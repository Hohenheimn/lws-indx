import React from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  variant?: string;
};

export const Button = ({
  children,
  className = "",
  disabled,
  type = "button",
  variant,
  ...rest
}: ButtonProps) => {
  return (
    <div
      className={twMerge(
        disabled ? "cursor-not-allowed" : "",
        "relative overflow-hidden ripple-surface-light w-full"
      )}
    >
      <button
        type={type}
        className={twMerge(
          "overflow-hidden whitespace-nowrap tracking-wider w-full bg-primary-500 border border-solid border-primary-500 text-white font-medium px-8 py-2 text-base rounded-md shadow-md hover:bg-primary-600 hover:shadow-lg active:bg-primary-700 active:shadow-lg transition duration-300 ease-in-out",
          className
        )}
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        disabled={disabled ?? false}
        {...rest}
      >
        {children}
      </button>
    </div>
  );
};
