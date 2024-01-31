import React from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { twMerge } from "tailwind-merge";
import { AnimateContainer } from "@components/animation";
import { fadeInUp, fadeIn } from "@components/animation/animation";

type A = React.HTMLAttributes<HTMLInputElement>;

type InputProps = {
  appearance?: "filled" | "outlined" | "standard";
  label?: string;
  name?: string;
  disabled?: boolean;
  prefix?: React.ReactNode | string;
  suffix?: React.ReactNode | string;
  type?: string;
  value?: string;
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
  type = "text",
  value = "",
  onChange,
  ...rest
}) => {
  let [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  let [inputValue, setInputValue] = React.useState("");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-base font-normal text-casper-500"
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
          type={isPasswordVisible && type === "password" ? "text" : type}
          name={name}
          id={name}
          autoComplete="off"
          className={twMerge(
            "focus:border-primary-500 focus:ring-0 focus:shadow-input p-4 bg-white border-default shadow rounded-md transition block w-full text-sm leading-[normal] disabled:bg-[#f5f5f5]",
            `${prefix ? "pl-8" : ""} ${suffix ? "pr-12" : ""}`,
            className
          )}
          disabled={disabled}
          value={value ? value : inputValue ? inputValue : ""}
          onChange={(e) => {
            onChange && onChange(e);
            setInputValue(e.target.value);
          }}
          {...rest}
        />
        {(type === "password" || suffix) && (
          <div className="absolute inset-y-0 right-0 flex items-center px-4 gap-4 text-base [&>svg]:transition [&>*]:cursor-pointer [&>svg]:text-default-text hover:[&>svg]:opacity-70">
            {suffix}
            {type === "password" && (
              <AnimateContainer
                variants={fadeIn}
                key={isPasswordVisible.toString()}
              >
                {isPasswordVisible ? (
                  <BsEyeFill
                    onClick={() => setIsPasswordVisible(false)}
                    data-ping="link"
                    data-ping-type={"link"}
                  />
                ) : (
                  <BsEyeSlashFill
                    onClick={() => setIsPasswordVisible(true)}
                    data-ping="link"
                    data-ping-type={"link"}
                  />
                )}
              </AnimateContainer>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
