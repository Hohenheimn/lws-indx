import React from "react";
import { DatePicker as DP } from "antd";

interface DatePickerProps
  extends React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> {}

export const DatePicker: DatePickerProps = ({
  children,
  className,
  disabled,
  ...rest
}) => {
  return <DP />;
};

export default DatePicker;
