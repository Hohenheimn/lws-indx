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
        <div id={id} className={wrapperClassName}>
            <Upload
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={dummyRequest}
                //   maxCount={1}
                multiple={true}
                className={className}
                onChange={(e) => console.log(e, "asdf")}
                {...rest}
            >
                {children}
            </Upload>
        </div>
    );
}
