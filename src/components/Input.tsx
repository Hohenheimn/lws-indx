import React from "react";
import { classNameMerge } from "../../utils/helpers";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  appearance?: "filled" | "outlined" | "standard";
  label?: string;
}

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
> = ({ children, className, disabled, appearance, label, ...rest }) => {
  if (appearance === "filled") {
    return (
      <div className="relative">
        <input
          type="text"
          className="block rounded-t-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 border-0 border-b-2 border-primary-500 appearance-none focus:border-primary-600 placeholder:opacity-0 focus:placeholder:opacity-50 placeholder:transition placeholder:ease-in placeholder:duration-[3000] peer"
          {...rest}
        />
        {label && (
          <label
            htmlFor="floating_filled"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
  return (
    <div className="relative z-0">
      <input
        type="text"
        className={classNameMerge(
          appearanceChecker(appearance).input,
          "block w-full text-sm bg-trasparent text-gray-900 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-primary-600 placeholder:opacity-0 focus:placeholder:opacity-50 placeholder:transition placeholder:ease-in placeholder:duration-[3000] peer"
        )}
        {...rest}
      />
      {label && (
        <label
          htmlFor={rest.id}
          className={classNameMerge(
            appearanceChecker(appearance).label,
            "absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform origin-[0] peer-focus:text-primary-600 peer-focus:dark:text-primary-500"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Input;
