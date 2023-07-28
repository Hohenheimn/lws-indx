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

const { Dragger } = Upload;

export default function UploaderMultiple({
    image,
    setImage,
    children,
    className,
    wrapperClassName,
    id,
    ...rest
}: any) {
    const beforeUpload = (file: any) => {
        const applicationType = file?.name.split(".").pop();
        const allowedFile =
            file.type === "image/jpg" ||
            file.type === "image/jpeg" ||
            file.type === "image/png" ||
            file.type === "video/mp4" ||
            file.type === "video/ogg";
        // ||applicationType === "pdf";

        if (!allowedFile) {
            message.error(
                "You can only upload jpg | jpeg | png | mp4 | ogg file"
            );
        }
        return allowedFile;
    };

    return (
        <div id={id} className={wrapperClassName}>
            <Upload
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={dummyRequest}
                //   maxCount={1}
                multiple={true}
                className={className}
                listType="picture"
                onChange={(e) => console.log(e, "asdf")}
                {...rest}
            >
                {children}
            </Upload>
        </div>
    );
}
