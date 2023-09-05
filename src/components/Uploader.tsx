import { useRef, useState } from "react";
import { Upload, message, Image } from "antd";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { AiFillCamera } from "react-icons/ai";

import { MdOutlinePermMedia } from "react-icons/md";
import Webcam from "react-webcam";

import { fadeIn } from "./animation/animation";
import { Button } from "./Button";
import Modal from "./Modal";

interface UploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  image: any;
  setImage: any;
  className: string;
  children: any;
}

const dummyRequest = ({ onSuccess }: any) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

export default function Uploader({
  image,
  setImage,
  children,
  className,
  wrapperClassName,
  id,
  capture,
  ...rest
}: any) {
  const [isModalShow, setModalShow] = useState(false);
  const [isModalShowCapture, setModalShowCapture] = useState(false);

  const beforeUpload = (file: File) => {
    const applicationType = file?.name.split(".").pop();
    const allowedFile =
      file.type === "image/jpg" ||
      file.type === "image/jpeg" ||
      file.type === "image/png";
    // ||applicationType === "pdf";
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!allowedFile) {
      message.error("You can only upload jpg | jpeg | png file");
      return;
    }

    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return;
    }

    if (!allowedFile || !isLt2M) {
      setImage({
        ...image,
        imageUrl: null,
        error: false,
        file: null,
      });
      return;
    }
    setImage({
      ...image,
      imageUrl: URL.createObjectURL(file),
      error: false,
      file: file,
    });
    setModalShow(false);
    setModalShowCapture(false);
    setCapturedImage(null);
    return allowedFile && isLt2M;
  };

  const webcamRef = useRef<any>(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const handleUpload = () => {
    if (capturedImage) {
      const blob: any = convertDataURLtoBlob(capturedImage);
      const file = new File([blob], "webcam-image.png", { type: "image/png" });
      beforeUpload(file);
    }
  };

  const convertDataURLtoBlob = (dataURL: any) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  if (capture) {
    return (
      <>
        <Modal
          onClose={() => {
            setModalShow(false);
          }}
          show={isModalShow}
        >
          <Modal
            show={isModalShowCapture}
            onClose={() => {
              setCapturedImage(null);
              setModalShowCapture(false);
            }}
            className="w-11/12 max-w-[50rem] "
          >
            <div className=" w-full aspect-[1.3/1] relative">
              <aside className="absolute w-full h-full top-0 left-0">
                {capturedImage ? (
                  <Image src={capturedImage} alt="Captured" />
                ) : (
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full"
                    {...rest}
                  />
                )}
              </aside>
            </div>

            <div className="flex w-full items-center justify-between mt-5">
              <div>
                {capturedImage ? (
                  <Button
                    onClick={() => setCapturedImage(null)}
                    appearance="primary"
                  >
                    Re-Capture Image
                  </Button>
                ) : (
                  <Button onClick={captureImage} appearance="primary">
                    Capture Image
                  </Button>
                )}
              </div>
              {capturedImage && (
                <div>
                  <Button onClick={handleUpload} appearance="primary">
                    Upload Image
                  </Button>
                </div>
              )}
            </div>
            <div className=" flex justify-start mt-5">
              <div>
                <Button
                  onClick={() => {
                    setCapturedImage(null);
                    setModalShowCapture(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
          <div className=" flex space-x-10">
            <div
              onClick={() => setModalShowCapture(true)}
              className=" flex flex-col items-center cursor-pointer hover:text-primary-600 duration-100 hover:scale-105"
            >
              <AiFillCamera className="text-3xl" />
              <p>Capture Image</p>
            </div>
            <Upload
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={dummyRequest}
              multiple={false}
              className={className}
              {...rest}
            >
              <div className=" flex flex-col items-center cursor-pointer hover:text-primary-600 duration-100 hover:scale-105">
                <MdOutlinePermMedia className="text-3xl" />
                <p>Upload Image</p>
              </div>
            </Upload>
          </div>
        </Modal>
        <div
          id={id}
          className={wrapperClassName + " cursor-pointer"}
          onClick={() => setModalShow(true)}
        >
          {children}
        </div>
      </>
    );
  }
  return (
    <div id={id} className={wrapperClassName}>
      <Upload
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={dummyRequest}
        //   maxCount={1}
        multiple={false}
        className={className}
        // onChange={(e) => console.log(e, "asdf")}
        {...rest}
      >
        {children}
      </Upload>
    </div>
  );
}
