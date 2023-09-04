import React from "react";
import { useRouter } from "next/router";
import { Button } from "@components/Button";

import Card from "@components/Card";

import BillingDetails from "./Actions/BillingDetails";
import ChangePasswordAD from "./Actions/ChangePasswordAD";
import ChangePlan from "./Actions/ChangePlan";
import ManagePaymentInfo from "./Actions/ManagePaymentInfo";

const li = "flex justify-between space-x-2 items-center";

export function AccountDetails({ patientRecord }: any) {
  const router = useRouter();
  const [toShow, setToShow] = React.useState("");

  return (
    <>
      {toShow === "" && (
        <Card className="flex-auto md:p-12 p-6">
          <ul className=" w-full space-y-8">
            <li className={li}>
              <p className=" font-semibold">Member Since:</p>
              <p className=" font-semibold">May 3, 2021</p>
            </li>
            <li className={li}>
              <p className=" font-semibold">
                Account Status: <span className=" font-bold">Active</span>
              </p>
              <div>
                <Button appearance="normal" className=" bg-gray-200">
                  Unsubscribe
                </Button>
              </div>
            </li>
            <li className={li}>
              <p className=" font-semibold">
                Account Type: <span className=" font-bold">Basic</span>
              </p>
              <p
                className=" font-semibold text-primary-500 hover:text-primary-400 cursor-pointer"
                onClick={() => setToShow("change plan")}
              >
                Change Plan
              </p>
            </li>
            <li className={li}>
              <p className=" font-semibold">Password</p>
              <p
                className=" font-semibold text-primary-500 hover:text-primary-400 cursor-pointer"
                onClick={() => setToShow("change password")}
              >
                Change Password
              </p>
            </li>
            <li className={li}>
              <p className=" font-semibold">
                Your available SMS Credit is:{" "}
                <span className=" font-bold">500</span>
              </p>
              <p
                className=" font-semibold text-primary-500 hover:text-primary-400 cursor-pointer"
                onClick={() =>
                  router.push("/admin/settings/sms-manager?but_SMS_credit=true")
                }
              >
                Buy SMS Credits
              </p>
            </li>
            <li className={li}>
              <p className=" font-semibold">Manage Payment Info</p>
              <p
                className=" font-semibold text-primary-500 hover:text-primary-400 cursor-pointer"
                onClick={() => setToShow("manage payment")}
              >
                Update
              </p>
            </li>
            <li className={li}>
              <p className=" font-semibold">
                Next Billing Date Is{" "}
                <span className=" font-bold">May 15 2021</span>
              </p>
              <p
                className=" font-semibold text-primary-500 hover:text-primary-400 cursor-pointer"
                onClick={() => setToShow("billing details")}
              >
                Billing Details
              </p>
            </li>
            <li className={li}>
              <p className=" font-semibold">Application Settings</p>
              <p
                className=" font-semibold text-primary-500 hover:text-primary-400 cursor-pointer"
                onClick={() =>
                  router.push("/admin/settings/application-settings")
                }
              >
                Update
              </p>
            </li>
          </ul>
        </Card>
      )}

      {toShow === "change plan" && <ChangePlan onBack={() => setToShow("")} />}
      {toShow === "change password" && (
        <ChangePasswordAD onBack={() => setToShow("")} />
      )}
      {toShow === "manage payment" && (
        <ManagePaymentInfo onBack={() => setToShow("")} />
      )}
      {toShow === "billing details" && (
        <BillingDetails onBack={() => setToShow("")} />
      )}
    </>
  );
}

export default AccountDetails;
