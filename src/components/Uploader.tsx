import { Upload, message } from "antd";

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
  id,
  ...rest
}: any) {
  const beforeUpload = (file: any) => {
    const applicationType = file?.name.split(".").pop();
    const allowedFile =
      file.type === "image/jpg" ||
      file.type === "image/jpeg" ||
      file.type === "image/png";
    // ||applicationType === "pdf";
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!allowedFile) {
      message.error("You can only upload jpg | jpeg | png file");
    }

    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }

    if (!allowedFile || !isLt2M) {
      setImage({
        ...image,
        imageUrl: null,
        error: false,
        file: null,
      });
    }

    return allowedFile && isLt2M;
  };
  return (
    <div id={id}>
      <Upload
        showUploadList={false}
        beforeUpload={beforeUpload}
        customRequest={dummyRequest}
        //   maxCount={1}
        multiple={false}
        className={className}
        {...rest}
      >
        {children}
      </Upload>
    </div>
  );
}
