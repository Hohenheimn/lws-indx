import React from "react";
import { classNameMerge } from "../../utils/helpers";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Cards({ children, className, ...rest }: CardProps) {
  return (
    <div
      className={classNameMerge(
        "bg-white p-6 rounded-2xl shadow-md shadow-slate-300",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
