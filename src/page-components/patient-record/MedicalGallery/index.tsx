import { Checkbox, DatePicker, Form, Popover, Table, notification } from "antd";
import React from "react";
import { scroller } from "react-scroll";
import { Button } from "../../../components/Button";
import Card from "../../../components/Card";
import Input from "../../../components/Input";
import { Select } from "../../../components/Select";
import { AiOutlineSearch } from "react-icons/ai";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { getBase64, numberSeparator } from "../../../../utils/helpers";
import { NextPageProps } from "../../../../utils/types/NextPageProps";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData, fetchData } from "../../../../utils/api";
import AddMedicalGalleryModal from "./AddMedicalGalleryModal";
import moment from "moment";
import Image from "next/image";
import Uploader from "../../../components/Uploader";
import Avatar from "../../../components/Avatar";
import { IoPersonOutline } from "react-icons/io5";

export function MedicalGallery({ patientRecord }: any) {
  const [MedicalGalleryForm] = Form.useForm();
  const queryClient = useQueryClient();
  let [page, setPage] = React.useState(1);
  let [search, setSearch] = React.useState("");
  let [image, setImage] = React.useState({
    imageUrl: "",
    error: false,
    file: null,
    loading: false,
    edit: false,
  });

  let [isMedicalGalleryModalOpen, setIsMedicalGalleryModalOpen] =
    React.useState(false);

  function handleChange(info: any) {
    if (info.file.status === "uploading") {
      return setImage({ ...image, loading: true, file: null, edit: false });
    }

    if (info.file.status === "error") {
      return setImage({ ...image, loading: false, error: true, edit: false });
    }

    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl: string) => {
        setImage({
          ...image,
          imageUrl,
          loading: false,
          file: info.file,
          edit: false,
        });
      });
      return info.file.originFileObj;
    }
  }

  // let { data: MedicalGallery } = useQuery(
  //   ["medical-gallery", page, search],
  //   () =>
  //     fetchData({
  //       url: `/api/patient/medical-gallery/${patientRecord._id}?limit=5&page=${page}&search=${search}`,
  //     })
  // );

  // const { mutate: deleteMedicalGallery }: any = useMutation(
  //   (treatment_plan_id: number) =>
  //     deleteData({
  //       url: `/api/patient/medical-gallery/${treatment_plan_id}`,
  //     }),
  //   {
  //     onSuccess: async (res) => {
  //       notification.success({
  //         message: "Treatment Plan Deleted",
  //         description: "Treatment Plan has been deleted",
  //       });
  //     },
  //     onMutate: async (newData) => {
  //       await queryClient.cancelQueries({ queryKey: ["medical-gallery"] });
  //       const previousValues = queryClient.getQueryData(["medical-gallery"]);
  //       queryClient.setQueryData(["medical-gallery"], (oldData: any) =>
  //         oldData ? [...oldData, newData] : undefined
  //       );

  //       return { previousValues };
  //     },
  //     onError: (err: any, _, context: any) => {
  //       notification.warning({
  //         message: "Something Went Wrong",
  //         description: `${
  //           err.response.data[Object.keys(err.response.data)[0]]
  //         }`,
  //       });
  //       queryClient.setQueryData(["medical-gallery"], context.previousValues);
  //     },
  //     onSettled: async () => {
  //       queryClient.invalidateQueries({ queryKey: ["medical-gallery"] });
  //     },
  //   }
  // );

  let sample = [];

  for (let i = 0; i <= 10; i++) {
    sample.push(i);
  }

  return (
    <>
      <Card className="flex-auto p-0">
        <div className="space-y-8 h-full flex flex-col">
          <div className="space-y-4 md:p-12 p-6">
            <div className="flex justify-between items-center gap-4 flex-wrap md:flex-nowrap">
              <h4 className="basis-full md:basis-auto">Medical Gallery</h4>
            </div>
            <div className="flex justify-between align-middle gap-4">
              <div className="basis-1/2">
                <Input
                  placeholder="Search"
                  prefix={
                    <AiOutlineSearch className="text-lg text-casper-500" />
                  }
                  className="rounded-full text-base shadow-none"
                  onChange={(e: any) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-12 !mt-12">
              <div className="h-48 w-full relative rounded-3xl border-2 border-gray-300">
                <Uploader
                  image={image}
                  setImage={(value: any) => setImage(value)}
                  id="profile_picture"
                  className="[&_.ant-upload]:!border-0 flex justify-center items-center h-full w-full"
                  wrapperClassName="h-full w-full"
                >
                  <div className="flex justify-center items-center w-full h-full text-base text-gray-400">
                    + Create Gallery
                  </div>
                </Uploader>
              </div>
              {sample.map((row, index) => {
                return (
                  <div
                    key={index}
                    className="h-48 w-full relative rounded-3xl border-2 border-gray-300"
                  >
                    <Image
                      src={`https://picsum.photos/seed/${row}/1000/500`}
                      alt="random pics"
                      fill
                      sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                      objectFit="cover"
                      className="rounded-[inherit]"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
      <AddMedicalGalleryModal
        show={isMedicalGalleryModalOpen}
        onClose={() => {
          setIsMedicalGalleryModalOpen(false);
          MedicalGalleryForm.resetFields();
        }}
        className="w-[50rem]"
        id="medical-gallery-modal"
        patientRecord={patientRecord}
        form={MedicalGalleryForm}
      />
    </>
  );
}

export default MedicalGallery;
