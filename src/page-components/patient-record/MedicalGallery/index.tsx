import React, { useState } from "react";
import { Checkbox, DatePicker, Form, Popover, Table, notification } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import moment from "moment";
import Image from "next/image";
import { AiOutlineSearch } from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsEyeFill, BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { IoPersonOutline } from "react-icons/io5";
import { scroller } from "react-scroll";
import Avatar from "@components/Avatar";
import { Button } from "@components/Button";
import Card from "@components/Card";
import Input from "@components/Input";
import { Select } from "@components/Select";
import Uploader from "@components/Uploader";

import { fadeIn } from "@src/components/animation/animation";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteData, fetchData } from "@utilities/api";
import { getBase64, numberSeparator } from "@utilities/helpers";
import { NextPageProps } from "@utilities/types/NextPageProps";

import AddMedicalGalleryModal from "./AddMedicalGalleryModal";

export function MedicalGallery({ patientRecord }: any) {
    const [MedicalGalleryForm] = Form.useForm();
    const queryClient = useQueryClient();
    let [page, setPage] = React.useState(1);
    let [search, setSearch] = React.useState("");

    const [SelectedEdit, setSelectedEdit] = useState<{
        id: number | null | undefined;
        title: string;
        date_uploaded: any;
        note: string;
    }>({
        id: null,
        title: "",
        date_uploaded: "",
        note: "",
    });

    let [
        isMedicalGalleryModalOpen,
        setIsMedicalGalleryModalOpen,
    ] = React.useState(false);

    const tabs = ["All", "Before and After", "Xray", "Videos", "Others"];

    const [isTabActive, setTabActive] = useState("All");

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

    let galleries = [
        {
            id: 1,
            note: "sample note 1",
            image: "",
            title: "gallery 1",
            date_uploaded: "",
        },
        {
            id: 2,
            note: "sample note 2",
            image: "",
            title: "gallery 2",
            date_uploaded: "",
        },
        {
            id: 3,
            note: "sample note",
            image: "",
            title: "gallery 3",
            date_uploaded: "",
        },
        {
            id: 4,
            note: "sample note",
            image: "",
            title: "gallery 4",
            date_uploaded: "",
        },
        {
            id: 5,
            note: "sample note",
            image: "",
            title: "gallery 5",
            date_uploaded: "",
        },
    ];

    const BackHandler = () => {
        console.log(SelectedEdit);
        setSelectedEdit({
            id: null,
            title: "",
            date_uploaded: "",
            note: "",
        });
    };

    return (
        <>
            <Card className="flex-auto p-0">
                <div className="space-y-8 h-full flex flex-col">
                    <div className="space-y-4 md:p-12 p-6">
                        <div className="flex justify-between items-center flex-wrap md:flex-nowrap">
                            <h4 className="basis-full md:basis-auto">
                                Medical Gallery
                            </h4>
                            {SelectedEdit.id !== undefined &&
                                SelectedEdit.id !== null && (
                                    <Button
                                        className="p-3 inline-block w-auto"
                                        appearance="primary"
                                        onClick={BackHandler}
                                    >
                                        BACK
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
                                    onChange={(e: any) =>
                                        setSearch(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <ul className="flex">
                            {tabs.map((row, index) => (
                                <li
                                    key={index}
                                    className={`cursor-pointer mr-5 ${row ===
                                        isTabActive &&
                                        " text-primary-500 border-b border-primary-500"}`}
                                    onClick={() => setTabActive(row)}
                                >
                                    {row}
                                </li>
                            ))}
                        </ul>

                        {SelectedEdit.id !== undefined &&
                            SelectedEdit.id !== null && (
                                <div className="flex justify-between align-middle gap-4">
                                    <div className="basis-1/2 grid grid-cols-2 gap-5">
                                        <div>
                                            <Input
                                                placeholder="Gallery Title"
                                                className=" text-base shadow-none"
                                                value={SelectedEdit.title}
                                                onChange={(e: any) => {
                                                    setSelectedEdit({
                                                        ...SelectedEdit,
                                                        title: e.target.value,
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <DatePicker
                                                // value={
                                                //     SelectedEdit.date_uploaded
                                                // }
                                                getPopupContainer={(
                                                    triggerNode: any
                                                ) => {
                                                    return triggerNode.parentNode;
                                                }}
                                                onChange={(e) => {
                                                    setSelectedEdit({
                                                        ...SelectedEdit,
                                                        date_uploaded: e
                                                            ?.format(
                                                                "YYYY/MM/DD"
                                                            )
                                                            .toString(),
                                                    });
                                                }}
                                                placeholder="Date Uploaded"
                                                format="MMMM DD, YYYY"
                                                disabled={false}
                                                style={{ boxShadow: "none" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        <div className="grid grid-cols-4 gap-12 !mt-12">
                            <div className="aspect-[1.3/1] w-full relative rounded-3xl border-2 border-gray-300">
                                <div
                                    onClick={() =>
                                        setIsMedicalGalleryModalOpen(true)
                                    }
                                    className=" cursor-pointer flex justify-center items-center w-full h-full text-base text-gray-400"
                                >
                                    + Create Gallery
                                </div>
                            </div>
                            {galleries.map((gallery, index) => {
                                return (
                                    <div>
                                        <div
                                            key={index}
                                            className=" aspect-[1.3/1] w-full relative rounded-3xl border-2 border-gray-300"
                                        >
                                            <Popover
                                                showArrow={false}
                                                content={
                                                    <div className="grid grid-cols-1 gap-2">
                                                        <Button
                                                            appearance="link"
                                                            className="text-casper-500 p-2"
                                                            onClick={() =>
                                                                setSelectedEdit(
                                                                    {
                                                                        id:
                                                                            gallery.id,
                                                                        title:
                                                                            gallery.title,
                                                                        date_uploaded:
                                                                            gallery.date_uploaded,
                                                                        note:
                                                                            gallery.note,
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <BsPencilSquare className="text-base" />
                                                                <div>Edit</div>
                                                            </div>
                                                        </Button>
                                                        <Button
                                                            appearance="link"
                                                            className="text-casper-500 p-2"
                                                            onClick={() => {}}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <BsTrashFill className="text-base" />
                                                                <div>
                                                                    Delete
                                                                </div>
                                                            </div>
                                                        </Button>
                                                    </div>
                                                }
                                                trigger="click"
                                            >
                                                <BiDotsHorizontalRounded className=" cursor-pointer absolute z-10 top-1 right-1 text-white text-4xl" />
                                            </Popover>

                                            <Image
                                                src={`https://picsum.photos/seed/${gallery.id}/1000/500`}
                                                alt="random pics"
                                                fill
                                                sizes="(max-width: 500px) 100px, (max-width: 1023px) 400px, 1000px"
                                                objectFit="cover"
                                                className="rounded-[inherit]"
                                            />
                                        </div>
                                        <AnimatePresence>
                                            {SelectedEdit.id === gallery.id && (
                                                <motion.div variants={fadeIn}>
                                                    <TextArea
                                                        placeholder="Notes"
                                                        value={
                                                            SelectedEdit.note
                                                        }
                                                        className=" border-2 border-gray-300 text-base shadow-none p-1 mt-3"
                                                        onChange={(e: any) => {
                                                            setSelectedEdit({
                                                                ...SelectedEdit,
                                                                note:
                                                                    e.target
                                                                        .value,
                                                            });
                                                        }}
                                                    />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
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
