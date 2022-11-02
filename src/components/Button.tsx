import React from "react";

interface ButtonProps
  extends React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> {}

export const Button: ButtonProps = ({
  children,
  className,
  disabled,
  ...rest
}) => {
  return (
    <div className={`${disabled ? "cursor-not-allowed" : ""}`}>
      <button
        className={`inline-block whitespace-nowrap tracking-wider px-8 py-3 w-full bg-primary-500 text-white font-semibold text-xl rounded shadow-md hover:bg-primary-600 hover:shadow-lg active:bg-primary-700 active:shadow-lg transition duration-300 ease-in-out ${
          className ?? ""
        }`}
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
