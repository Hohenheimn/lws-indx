import React, { useEffect, useState } from "react";
import { Checkbox, Form, Radio, notification } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { scroller } from "react-scroll";
import Modal from "@components/Modal";
import { Button } from "@src/components/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchData,
  fetchDataNoSubdomain,
  payment_base_url,
  postDataMultipleFile,
  postDataNoFormData,
  postDataNoSubDomain,
} from "@utilities/api";
import { Context } from "@utilities/context/Provider";

export default function BuySMSCreditModal({
  show,
  onClose,
  form,
  profile,
  patientRecord,
  ...rest
}: any) {
  const [isSubdomain, setSubdomain] = useState<string | undefined>("");

  const router = useRouter();

  useEffect(() => {
    if (window?.location?.origin) {
      let getSubDomain: string | string[] = window?.location?.origin.replace(
        "https://",
        ""
      );
      if (!router.pathname.includes("/admin")) {
        setSubdomain(undefined);
        return;
      }
      getSubDomain = getSubDomain.replace("http://", "");
      getSubDomain = getSubDomain.replace("https://", "");
      getSubDomain = getSubDomain.replace("www.", "");
      getSubDomain = getSubDomain.split(".");
      getSubDomain = getSubDomain[0];
      setSubdomain(getSubDomain);
    }
  });

  const { setIsAppLoading } = React.useContext(Context);

  let { data: smsCredits } = useQuery(["sms-subscription"], () =>
    fetchDataNoSubdomain({
      url: `/api/subscriptions?type=SMS Credits`,
    })
  );

  return (
    <Modal show={show} onClose={onClose} {...rest}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="font-bold text-3xl">Buy SMS Credit</div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            values.email = profile.email;
            values.contact_no = profile.mobile_no.replaceAll("-", "");
            values.clinic_url = isSubdomain;
            setIsAppLoading(true);
            router.push(
              `${payment_base_url}?email=${values.email}&subscription_id=${values.subscription_id}&contact_no=${values.contact_no}&clinic_url=${values.clinic_url}`
            );
            // subscripton(values);
          }}
          onFinishFailed={(data) => {
            scroller.scrollTo(
              data?.errorFields[0]?.name?.join("-")?.toString(),
              {
                smooth: true,
                offset: -50,
                containerId: rest?.id,
              }
            );
          }}
          className="space-y-12"
        >
          <Form.Item
            name="subscription_id"
            required={false}
            className="text-base"
          >
            <Radio.Group className="w-full">
              <ul className="w-full">
                {smsCredits?.map((item: any, index: number) => (
                  <li
                    key={index}
                    className="flex justify-between border-b border-gray-300 py-5"
                  >
                    <p className=" text-xl font-semibold">{item.name}</p>
                    <Radio value={item._id} />
                  </li>
                ))}
              </ul>
            </Radio.Group>
          </Form.Item>
          <div className="flex justify-end items-center gap-4">
            <Button
              appearance="link"
              className="p-4 bg-transparent border-none text-casper-500 font-semibold"
              onClick={() => onClose()}
            >
              Cancel
            </Button>
            <Button
              appearance="primary"
              className="max-w-[10rem]"
              type="submit"
            >
              Save
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
}
