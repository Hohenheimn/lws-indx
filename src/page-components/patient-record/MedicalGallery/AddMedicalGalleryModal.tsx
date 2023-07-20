import React from "react";
import { DatePicker, Form, TimePicker, notification } from "antd";
import { Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import Image from "next/image";
import { AiOutlineInbox } from "react-icons/ai";
import { NumericFormat } from "react-number-format";
import { scroller } from "react-scroll";
import { Button } from "@components/Button";
import { InfiniteSelect } from "@components/InfiniteSelect";
import Input from "@components/Input";
import Modal from "@components/Modal";
import Uploader from "@src/components/Uploader";
import UploaderMultiple from "@src/components/UploaderMultiple";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData, postData } from "@utilities/api";
import { Context } from "@utilities/context/Provider";
import {
    getBase64,
    getInitialValue,
    removeNumberFormatting,
} from "@utilities/helpers";

export default function AddMedicalGalleryModal({
    show,
    onClose,
    form,
    patientRecord,
    ...rest
}: any) {
    const queryClient = useQueryClient();
    const { setIsAppLoading } = React.useContext(Context);

    let [image, setImage] = React.useState({
        imageUrl: "",
        error: false,
        file: null,
        loading: false,
        edit: false,
    });
    function handleChange(info: any) {
        console.log(info);
        if (info.file.status === "uploading") {
            return setImage({
                ...image,
                loading: true,
                file: null,
                edit: false,
            });
        }

        if (info.file.status === "error") {
            return setImage({
                ...image,
                loading: false,
                error: true,
                edit: false,
            });
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

    const { mutate: addMedicalGallery } = useMutation(
        (payload: any) => {
            return postData({
                url: `/api/patient/medical-gallery/${patientRecord?._id}`,
                payload,
                options: {
                    isLoading: (show: boolean) => setIsAppLoading(show),
                },
            });
        },
        {
            onSuccess: async (res) => {
                notification.success({
                    message: "Adding Gallery Success",
                    description: `Adding gallery-list Success`,
                });
                form.resetFields();
                onClose();
            },
            onMutate: async (newData) => {
                await queryClient.cancelQueries({
                    queryKey: ["medical-gallery"],
                });
                const previousValues = queryClient.getQueryData([
                    "medical-gallery",
                ]);
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
                queryClient.setQueryData(
                    ["medical-gallery"],
                    context.previousValues
                );
            },
            onSettled: async () => {
                queryClient.invalidateQueries({
                    queryKey: ["medical-gallery"],
                });
            },
        }
    );

    const { mutate: editMedicalGallery } = useMutation(
        (payload: any) => {
            return postData({
                url: `/api/medical-gallery/update/${payload.id}?_method=PUT`,
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
                form.resetFields();
                onClose();
            },
            onMutate: async (newData) => {
                await queryClient.cancelQueries({
                    queryKey: ["medical-gallery"],
                });
                const previousValues = queryClient.getQueryData([
                    "medical-gallery",
                ]);
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
                queryClient.setQueryData(
                    ["medical-gallery"],
                    context.previousValues
                );
            },
            onSettled: async () => {
                queryClient.invalidateQueries({
                    queryKey: ["medical-gallery"],
                });
            },
        }
    );

    return (
        <Modal show={show} onClose={onClose} {...rest}>
            <div>
                <UploaderMultiple
                    image={image}
                    setImage={(value: any) => setImage(value)}
                    onChange={handleChange}
                    id="gallery_picture"
                    className="[&_.ant-upload]:!border-0 h-full w-full bg-none"
                    wrapperClassName="h-full w-full border flex justify-center items-center border-dashed p-4"
                >
                    <div className=" w-full flex justify-center flex-col items-center">
                        <AiOutlineInbox className=" text-5xl text-primary-500 mb-2" />
                        <h3 className=" text-center mb-2 text-2xl">
                            Click or drag-file to this area to upload
                        </h3>
                        <p className=" text-center text-lg text-gray-400">
                            Support for a single or bulk upload. Stricktly
                            prohibit from uploading company data or other band
                            files
                        </p>
                    </div>
                </UploaderMultiple>
            </div>
        </Modal>
    );
}
