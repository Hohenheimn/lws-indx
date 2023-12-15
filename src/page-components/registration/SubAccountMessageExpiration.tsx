import React from "react";
import { notification } from "antd";
import Image from "next/image";
import Link from "next/link";
import { destroyCookie } from "nookies";
import { useQueryClient } from "@tanstack/react-query";

const SubAccountMessageExpiration = () => {
  const queryClient = useQueryClient();
  return (
    <section className=" w-screen h-screen flex justify-center items-center flex-col bg-primary text-white">
      <Image
        src={"/images/white-logo.png"}
        alt="random pics"
        width={300}
        height={100}
        className="object-center mb-10"
      />
      <h2 className=" text-white mb-3">Hello!</h2>
      <p className=" text-[1.5rem] w-10/12 max-w-[40rem] text-center">
        As you are currently logged in as a sub-account user, please reach out
        to the account owner as it appears that the subscription has lapsed.
      </p>
      <div>
        <Link
          href={"/admin"}
          onClick={() => {
            queryClient.removeQueries();
            destroyCookie(undefined, "a_t", { path: "/" });
            destroyCookie(undefined, "subdomain", { path: "/" });
            window.localStorage.clear();
            notification.success({
              message: "Logout Succesful",
              description: "All done! Have a nice day!",
            });
          }}
          className=" bg-white text-primary-500 font-bold mt-5 px-5 py-2 block rounded-lg shadow-md text-lg"
        >
          Logout
        </Link>
      </div>
    </section>
  );
};

export default SubAccountMessageExpiration;
