import React from "react";
import { twMerge } from "tailwind-merge";

type A = React.HTMLAttributes<HTMLInputElement>;

type InputProps = {
  appearance?: "filled" | "outlined" | "standard";
  label?: string;
  name?: string;
  disabled?: boolean;
  prefix?: React.ReactNode | string;
  suffix?: React.ReactNode | string;
} & Omit<A, "prefix">;

type AppearanceCheckerProps = {
  input: string;
  label: string;
};

function appearanceChecker(appearance?: string): AppearanceCheckerProps {
  if (appearance === "filled") {
    return {
      input: "border-1 rounded-lg px-2.5 pb-2.5 pt-5",
      label:
        "-translate-y-4 scale-75 top-4 z-10 left-2.5 peer-focus:-translate-y-4",
    };
  }
  if (appearance === "outlined") {
    return {
      input: "border-1 rounded-lg px-2.5 pb-2.5 pt-4",
      label:
        "-translate-y-4 scale-75 top-2 z-10 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1",
    };
  }
  return { input: "border-1 border-b-2", label: "" };
}

export const Input: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputProps
> = ({
  children,
  className,
  disabled,
  appearance,
  label,
  name,
  prefix,
  suffix,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block text-base font-normal text-gray-500"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {prefix}
          </div>
        )}
        <input
          type="text"
          name={name}
          id={name}
          className={twMerge(
            "focus:border-primary-500 focus:ring-primary-500 sm:text-sm placeholder:text-gray-300 p-4 bg-white border-gray-300 shadow-md rounded-md",
            `transition block w-full ${prefix ? "pl-8" : ""} ${
              suffix ? "pr-12" : ""
            }`,
            className
          )}
          {...rest}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
