import React from "react";
import { twMerge } from "tailwind-merge";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  innerRef?: any;
}

export default function Card({
  children,
  className,
  innerRef,
  ...rest
}: CardProps) {
  return (
    <div
      className={twMerge(
        "bg-white p-6 rounded-2xl shadow-md shadow-slate-300 relative text-base",
        className
      )}
      ref={innerRef}
      {...rest}
    >
      {children}
    </div>
  );
}
