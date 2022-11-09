import React from "react";

interface DatePickerProps
  extends React.FC<React.InputHTMLAttributes<HTMLInputElement>> {}

export const DatePicker: DatePickerProps = ({
  children,
  className,
  disabled,
  ...rest
}) => {
  return <></>;
};

export default DatePicker;
