import React, { useState } from "react";
import { Form, Popover, notification, Image, Pagination } from "antd";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { Button } from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";
import { fadeIn } from "@src/components/animation/animation";

import VideoPlayer from "@src/components/VideoPlayer";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteData, fetchData, postData } from "@utilities/api";

import { Context } from "@utilities/context/Provider";

import AddMedicalGalleryModal from "./AddMedicalGalleryModal";
import GalleryItem from "./GalleryItem";

export type galleryType = {
  _id: string;
  patient_id: string;
  filename: string;
  category: string;
  name: string;
  description: string;
  user_id: string;
  created_at: string;
};

export type SelectedEditType = {
  id: number | null | undefined | string;
  name: string;
  description: string;
};

export function MedicalGallery({ patientRecord, pageType }: any) {
  const [MedicalGalleryForm] = Form.useForm();
  const queryClient = useQueryClient();
  let [page, setPage] = React.useState(1);
  const { setIsAppLoading } = React.useContext(Context);
  let [search, setSearch] = React.useState("");

  const [SelectedEdit, setSelectedEdit] = useState<SelectedEditType>({
    id: null,
    name: "",
    description: "",
  });

  const [prevSelectedEdit, setPrevSelectedEdit] = useState<SelectedEditType>({
    id: null,
    name: "",
    description: "",
  });

  let [
    isMedicalGalleryModalOpen,
    setIsMedicalGalleryModalOpen,
  ] = React.useState(false);

  const tabs = ["All", "Before and After", "Xray", "Videos", "Others"];

  const [isTabActive, setTabActive] = useState("All");

  let { data: MedicalGallery } = useQuery(
    ["medical-gallery", page, search, isTabActive === "All" ? "" : isTabActive],
    () =>
      fetchData({
        url: `/api/patient/gallery/${
          patientRecord._id
        }?limit=7&page=${page}&search=${search}&category=${
          isTabActive === "All" ? "" : isTabActive
        }`,
      })
  );

  const gallery_list: galleryType[] = MedicalGallery?.data
    ? MedicalGallery?.data
    : // [
      //     ...MedicalGallery.data,
      //     {
      //       _id: "23131",
      //       patient_id: "232131",
      //       filename: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
      //       category: "videos",
      //       name: "sample",
      //       description: "sample",
      //       user_id: "23455",
      //       created_at: "",
      //     },
      //   ]
      [];

  const { mutate: deleteMedicalGallery }: any = useMutation(
    (gallery_id: number) =>
      deleteData({
        url: `/api/patient/gallery/${gallery_id}`,
      }),
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Gallery Deleted",
          description: "Gallery has been deleted",
        });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: ["medical-gallery"],
        });
        const previousValues = queryClient.getQueryData(["medical-gallery"]);
        queryClient.setQueryData(["medical-gallery"], (oldData: any) =>
          oldData ? [...oldData, newData] : undefined
        );

        return { previousValues };
      },
      onError: (err: any, _, context: any) => {
        notification.warning({
          message: "Something Went Wrong",
          description: `${
            err.response.data[Object.keys(err.response.data)[0]]
          }`,
        });
        queryClient.setQueryData(["medical-gallery"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({
          queryKey: ["medical-gallery"],
        });
      },
    }
  );

  const { mutate: editMedicalGallery } = useMutation(
    (payload: { name: string; description: string }) => {
      return postData({
        url: `/api/patient/gallery/update/${SelectedEdit.id}?_method=PUT`,
        payload,
        options: {
          isLoading: (show: boolean) => setIsAppLoading(show),
        },
      });
    },
    {
      onSuccess: async (res) => {
        notification.success({
          message: "Gallery Updated!",
          description: `Gallery Updated!`,
        });
        setSelectedEdit({
          id: null,
          name: "",
          description: "",
        });
        setPrevSelectedEdit({
          id: null,
          name: "",
          description: "",
        });
      },
      onMutate: async (newData) => {
        await queryClient.cancelQueries({
          queryKey: ["medical-gallery"],
        });
        const previousValues = queryClient.getQueryData(["medical-gallery"]);
        queryClient.setQueryData(["medical-gallery"], (oldData: any) =>
          oldData ? [...oldData, newData] : undefined
        );

        return { previousValues };
      },
      onError: (err: any, _, context: any) => {
        notification.warning({
          message: "Something Went Wrong",
          description: `${
            err.response.data[Object.keys(err.response.data)[0]]
          }`,
        });
        queryClient.setQueryData(["medical-gallery"], context.previousValues);
      },
      onSettled: async () => {
        queryClient.invalidateQueries({
          queryKey: ["medical-gallery"],
        });
        setSelectedEdit({
          id: null,
          name: "",
          description: "",
        });
        setPrevSelectedEdit({
          id: null,
          name: "",
          description: "",
        });
      },
    }
  );

  const SaveHandler = () => {
    if (
      prevSelectedEdit.name === SelectedEdit.name &&
      prevSelectedEdit.description === SelectedEdit.description
    ) {
      setSelectedEdit({
        id: null,
        name: "",
        description: "",
      });
      setPrevSelectedEdit({
        id: null,
        name: "",
        description: "",
      });
      return;
    }
    editMedicalGallery({
      name: SelectedEdit.name,
      description: SelectedEdit.description,
    });
  };

  return (
    <>
      <Card className="flex-auto p-0">
        <div className="space-y-8 h-full flex flex-col">
          <div className="space-y-4 md:p-12 p-6">
            <div className="flex justify-between items-center flex-wrap md:flex-nowrap">
              <h4 className="basis-full md:basis-auto">Medical Gallery</h4>
              {SelectedEdit.id !== undefined && SelectedEdit.id !== null && (
                <Button
                  className="p-3 inline-block w-auto"
                  appearance="primary"
                  onClick={SaveHandler}
                >
                  {prevSelectedEdit.name === SelectedEdit.name &&
                  prevSelectedEdit.description === SelectedEdit.description
                    ? "BACK"
                    : "SAVE"}
                </Button>
              )}
            </div>

            <div className="flex justify-between align-middle gap-4 mb-5">
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

            <ul className="flex">
              {tabs.map((row, index) => (
                <li
                  key={index}
                  className={`cursor-pointer mr-5 ${row === isTabActive &&
                    " text-primary-500 border-b border-primary-500"}`}
                  onClick={() => setTabActive(row)}
                >
                  {row}
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 lg:gap-6 !mt-12">
              <div className="aspect-[1.3/1] w-full relative rounded-3xl overflow-hidden border-2 border-gray-300">
                <div
                  onClick={() => setIsMedicalGalleryModalOpen(true)}
                  className={` cursor-pointer flex justify-center items-center w-full h-full text-base text-gray-400 ${pageType ===
                    "view" && "bg-gray-100 pointer-events-none"}`}
                >
                  + Add
                </div>
              </div>
              <Image.PreviewGroup>
                {gallery_list
                  .filter(
                    (filter) =>
                      !filter.filename.includes(".mp4") &&
                      !filter.filename.includes(".mkv")
                  )
                  ?.map((gallery: galleryType, index) => {
                    return (
                      <GalleryItem
                        key={index}
                        pageType={pageType}
                        setSelectedEdit={setSelectedEdit}
                        setPrevSelectedEdit={setPrevSelectedEdit}
                        gallery={gallery}
                        deleteMedicalGallery={deleteMedicalGallery}
                        SelectedEdit={SelectedEdit}
                      />
                    );
                  })}
              </Image.PreviewGroup>
              {gallery_list
                .filter(
                  (filter) =>
                    filter.filename.includes(".mp4") ||
                    filter.filename.includes(".mkv")
                )
                ?.map((gallery: galleryType, index) => {
                  return (
                    <GalleryItem
                      key={index}
                      pageType={pageType}
                      setSelectedEdit={setSelectedEdit}
                      setPrevSelectedEdit={setPrevSelectedEdit}
                      gallery={gallery}
                      deleteMedicalGallery={deleteMedicalGallery}
                      SelectedEdit={SelectedEdit}
                    />
                  );
                })}
            </div>
            <div className=" flex justify-end mt-5">
              <Pagination
                current={page}
                onChange={(e) => setPage(e)}
                total={
                  MedicalGallery?.meta?.total ? MedicalGallery?.meta?.total : 1
                } // Total number of items
                pageSize={
                  MedicalGallery?.meta?.per_page
                    ? MedicalGallery?.meta?.per_page
                    : 1
                } // Number of items per page
              />
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
      {/* <VideoModal
        videoList={gallery_list
          .filter(
            (filter) =>
              filter.filename.includes(".mp4") ||
              filter.filename.includes(".mkv")
          )
          .map((item) => item.filename)}
        activeVideoIndex={activeVideoIndex}
        setActiveVideoIndex={setActiveVideoIndex}
      /> */}
    </>
  );
}

export default MedicalGallery;
