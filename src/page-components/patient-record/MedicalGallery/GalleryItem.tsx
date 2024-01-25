import React from "react";
import { Popover, Image } from "antd";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsPencilSquare, BsTrashFill } from "react-icons/bs";
import { fadeIn } from "@src/components/animation/animation";
import { Button } from "@src/components/Button";
import { Input } from "@src/components/Input";
import VideoPlayer from "@src/components/VideoPlayer";

import { SelectedEditType, galleryType } from ".";

type PropsType = {
  pageType: string;
  setSelectedEdit: Function;
  setPrevSelectedEdit: Function;
  gallery: galleryType;
  deleteMedicalGallery: any;
  SelectedEdit: SelectedEditType;
};

const GalleryItem = ({
  pageType,
  setSelectedEdit,
  setPrevSelectedEdit,
  gallery,
  deleteMedicalGallery,
  SelectedEdit,
}: PropsType) => {
  return (
    <div>
      <div className="  group  flex items-center aspect-[1.3/1] w-full relative rounded-3xl border-2 border-gray-300 overflow-hidden">
        {pageType === "edit" && (
          <Popover
            showArrow={false}
            content={
              <div className="grid grid-cols-1 gap-2">
                <Button
                  appearance="link"
                  className="text-casper-500 p-2"
                  onClick={() => {
                    setSelectedEdit({
                      id: gallery._id,
                      name: gallery.name,
                      description: gallery.description,
                    });
                    setPrevSelectedEdit({
                      id: gallery._id,
                      name: gallery.name,
                      description: gallery.description,
                    });
                  }}
                >
                  <div className="flex items-center gap-2">
                    <BsPencilSquare className="text-base" />
                    <div>Edit</div>
                  </div>
                </Button>
                <Button
                  appearance="link"
                  className="text-casper-500 p-2"
                  onClick={() => {
                    deleteMedicalGallery(gallery._id);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <BsTrashFill className="text-base" />
                    <div>Delete</div>
                  </div>
                </Button>
              </div>
            }
            trigger="click"
          >
            <BiDotsHorizontalRounded className=" cursor-pointer absolute z-10 top-1 right-1 text-primary-500 text-4xl" />
          </Popover>
        )}
        {gallery?.filename.includes(".mp4") ||
        gallery?.filename.includes(".mkv") ? (
          <VideoPlayer videoUrl={gallery?.filename} />
        ) : (
          <Image
            height={"100%"}
            width={"100%"}
            className=" object-contain"
            src={gallery.filename}
          />
        )}
      </div>
      <AnimatePresence>
        {SelectedEdit.id === gallery._id && (
          <motion.div variants={fadeIn}>
            <Input
              placeholder="Name"
              value={SelectedEdit.name}
              className=" border-2 border-gray-300 text-base shadow-none p-1 mt-3"
              onChange={(e: any) => {
                setSelectedEdit({
                  ...SelectedEdit,
                  name: e.target.value,
                });
              }}
            />
            <Input
              placeholder="Description"
              value={SelectedEdit.description}
              className=" border-2 border-gray-300 text-base shadow-none p-1 mt-3"
              onChange={(e: any) => {
                setSelectedEdit({
                  ...SelectedEdit,
                  description: e.target.value,
                });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryItem;
