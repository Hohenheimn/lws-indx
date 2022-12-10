import React from "react";
import { FaTooth } from "react-icons/fa";
import Router from "next/router";

export const LoadingScreen = () => {
  return (
    <div className="space-y-2 text-center text-3xl flex flex-col justify-center items-center font-light tracking-widest text-white">
      <FaTooth className="text-5xl animate-bounce" />
      <div>PLEASE WAIT...</div>
    </div>
  );
};

export default LoadingScreen;
