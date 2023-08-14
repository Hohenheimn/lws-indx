import React from "react";
// import { FaTooth } from "react-icons/fa";
// import Router from "next/router";
import Image from "next/image";

export const LoadingScreen = () => {
  return (
    <div className="z-[999999999] space-y-2 text-center text-3xl flex flex-col justify-center items-center font-light tracking-widest text-white">
      <div className="relative h-20 w-full">
        <Image
          src={`/images/loading-icon.webp`}
          alt="random pics"
          fill
          sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
          className="object-center"
          objectFit="contain"
        />
      </div>
      <div className="animate-pulse">Please wait...</div>
    </div>
  );
};
export default LoadingScreen;
