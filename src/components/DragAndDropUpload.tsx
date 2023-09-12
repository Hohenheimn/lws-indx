import React, { useState } from "react";
import { Upload, message, Image } from "antd";

const { Dragger } = Upload;

type Props = {
  children: React.ReactNode;
  id: string;
};

const DragAndDropUpload = ({ children, id, ...rest }: Props) => {
  const [uploadedFiles, setUploadedFiles] = useState<any>([]);

  const handleUpload = (info: any) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
      setUploadedFiles([...uploadedFiles, info.file]);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const customRequest = ({ onSuccess }: any) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const beforeUpload = (file: any) => {
    // if (file.size > 2000000) {
    //   message.error("File must be 5mb only");
    // }
    const applicationType = file?.name.split(".").pop();
    const allowedFile =
      file.type === "image/jpg" ||
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "video/mp4" ||
      file.type === "video/ogg";
    // ||applicationType === "pdf";

    if (!allowedFile) {
      message.error("You can only upload jpg | jpeg | png | mp4 | ogg file");
      return;
    }
    return allowedFile;
  };

  return (
    <Dragger
      id={id}
      beforeUpload={beforeUpload}
      customRequest={customRequest}
      accept=".jpg, .jpeg, .mp4, .ogg, .png"
      listType="picture"
      showUploadList={{
        showRemoveIcon: true,
        showPreviewIcon: false,
        showDownloadIcon: false,
      }}
      multiple
      onChange={handleUpload}
      {...rest}
    >
      {children}
    </Dragger>
  );
};

export default DragAndDropUpload;
