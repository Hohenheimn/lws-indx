import React from "react";
import { classNameMerge } from "../../utils/helpers";

type ButtonSubComponent = {
  children: React.ReactNode;
};

interface ButtonProps
  extends React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> {
  Group: React.FC<ButtonSubComponent>;
}

const Group: React.FC<ButtonSubComponent> = ({ children }) => {
  return (
    <div
      className={classNameMerge(
        "flex [&>div>button]:rounded-none",
        "[&>div>button]:first-of-child:bg-gray-500"
      )}
    >
      {children}
    </div>
  );
};

export const Button: ButtonProps = ({
  children,
  className = "",
  disabled,
  ...rest
}) => {
  return (
    <div
      className={classNameMerge(
        disabled ? "cursor-not-allowed" : "",
        "relative overflow-hidden ripple-surface-light"
      )}
    >
      <button
        type="button"
        className={classNameMerge(
          "inline-block overflow-hidden whitespace-nowrap tracking-wider px-8 py-3 w-full bg-primary-500 text-white font-medium text-lg rounded shadow-md hover:bg-primary-600 hover:shadow-lg active:bg-primary-700 active:shadow-lg transition duration-300 ease-in-out",
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

Button.Group = Group;
