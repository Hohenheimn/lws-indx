import React from "react";
import { twMerge } from "tailwind-merge";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      className={twMerge(
        "bg-white p-6 rounded-2xl shadow-md shadow-slate-300 relative",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
