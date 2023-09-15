import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";

export const LoadingScreen = ({ message }: any) => {
  const router = useRouter();
  return (
    <div className=" space-y-2 text-center text-3xl flex flex-col justify-center items-center font-light tracking-widest text-white">
      <div className="relative h-20 aspect-square">
        <Image
          src={`/images/loading-icon.webp`}
          alt="random pics"
          fill
          sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
          className="object-center animate-bounce "
          objectFit="contain"
        />
      </div>

      <div className="animate-pulse">
        {message ? message : "Please wait..."}
      </div>
    </div>
  );
};
export default LoadingScreen;
