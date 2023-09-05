import React, { useEffect } from "react";
import Image from "next/image";
import Annotation from "react-image-annotation";
import { twMerge } from "tailwind-merge";
import { Button } from "@components/Button";

import Input from "./Input";

interface AnnotateProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  image: string;
  defaultValue?: any;
  UpdateToothsHandler?: Function;
  ProceduresData?: {
    abbreviation: string;
    icon: string;
    color_code: string;
    cost: number;
    created_at: string;
    procedure_name: string;
    _id: string;
  }[];
  forModal?: boolean;
  setSearch?: Function;
  pageType: string;
  formType?: string;
  onClose?: () => void;
  form_id?: any;
}

const Shape = ({ children, geometry, style }: any) => {
  return (
    <div
      style={{
        ...style,
        height: `10%`,
        width: `10%`,
        minHeight: ".6rem",
        minWidth: ".6rem",
        borderRadius: geometry.type === "POINT" ? "100%" : 0,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // padding: "7.5%",
      }}
    >
      {children}
    </div>
  );
};

function renderHighlight({ annotation, active }: any) {
  const { geometry } = annotation;

  if (!geometry) return null;
  return (
    <Shape
      key={annotation.key}
      geometry={geometry}
      style={{
        border: "solid 1px transparent",
        boxShadow: active && "0 0 20px 20px rgba(255, 255, 255, 0.3) inset",
        background: annotation.data.color,
        position: "absolute",
        left: `${geometry.x}%`,
        top: `${geometry.y}%`,
        transform: `translate(-50%, -50%)`,
        color: "#333",
        fontWeight: 700,
      }}
    >
      <div className="text-[100%]">
        <Image
          src={annotation.data.icon}
          alt="Icon"
          height={20}
          width={20}
          className=" rounded-full flex justify-center aspect-square"
        />
      </div>
    </Shape>
  );
}

function renderSelector({ annotation, active }: any) {
  const { geometry } = annotation;

  if (!geometry) return null;
  return (
    <Shape
      key={annotation.key}
      geometry={geometry}
      style={{
        border: "solid 5px #12C8CE",
        boxShadow: "0 0 10px 0 #12C8CE",
        position: "absolute",
        left: `${geometry.x}%`,
        top: `${geometry.y}%`,
        transform: `translate(-50%, -50%)`,
        color: "#333",
        fontWeight: 700,
      }}
    ></Shape>
  );
}

function RenderContent({ annotation, key }: any) {
  const { geometry } = annotation;

  if (!geometry) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: `${geometry.x}%`,
        top: `${geometry.y}%`,
        transform: `translate(-50%, 30%)`,
        width: "10rem",
        background: "#fff",
        padding: "1rem",
        borderRadius: "1rem",
        boxShadow: "0 0 10px #ccc",
        zIndex: 100000000,
      }}
      key={key}
    >
      <div className="space-y-4">
        <h5>{annotation.data.title}</h5>
        <div>{annotation.data.description}</div>
      </div>
    </div>
  );
}

export function Annotate({
  disabled,
  className,
  image,
  defaultValue,
  UpdateToothsHandler,
  ProceduresData,
  setSearch,
  forModal,
  onClose,
  formType,
  pageType,
  form_id,
  ...rest
}: AnnotateProps) {
  let [annotations, setAnnotations] = React.useState<any>([]);
  let [annotation, setAnnotation] = React.useState({});

  useEffect(() => {
    setAnnotations(
      defaultValue?.annotations === undefined ? [] : defaultValue?.annotations
    );
  }, [defaultValue]);

  // console.log(annotations, "anos", annotation, "ano");

  function onChange(annotation: any) {
    setAnnotation(annotation);
  }

  const ResetProcedures = () => {
    setAnnotation({});
    setAnnotations([]);
    UpdateToothsHandler &&
      UpdateToothsHandler(
        defaultValue.tooth_no,
        defaultValue.tooth_position,
        []
      );
  };

  function onSubmit({ title, description, color, icon, annotation, id }: any) {
    const { geometry, data }: any = annotation;
    // close tagging procedure
    setAnnotation({});
    // display tagged procedure
    setAnnotations(
      annotations.concat({
        key: annotations.length + 1,
        geometry,
        procedure_id: id,
        data: {
          ...data,
          title,
          description,
          color,
          icon,
        },
      })
    );

    // add to array
    if (UpdateToothsHandler !== undefined) {
      UpdateToothsHandler(
        defaultValue.tooth_no,
        defaultValue.tooth_position,
        annotations.concat({
          key: annotations.length + 1,
          geometry,
          procedure_id: id,
          data: {
            ...data,
            title,
            description,
            color,
            icon,
          },
        })
      );
    }
  }

  function renderEditor({ annotation }: any) {
    const { geometry } = annotation;

    if (!geometry) return null;

    return (
      <div
        style={{
          left: `${geometry.x}%`,
          top: `${geometry.y}%`,
          height: `10%`,
          width: `10%`,
          borderRadius: geometry.type === "POINT" ? "100%" : 0,
          position: "absolute",
          zIndex: 10000,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "120%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
          className=" bg-white rounded-md shadow-md p-2 w-[60vw] lg:w-auto"
        >
          <Input
            placeholder="Search Procedure"
            onChange={(e: any) => {
              setSearch && setSearch(e.target.value);
            }}
            className=" w-full mb-5 "
          />
          <div className="w-full k grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 lg:w-80">
            {ProceduresData?.map((itemMap, index) => (
              <div key={index}>
                <div
                  key={index}
                  className=" bg-primary-500 cursor-pointer hover:bg-primary-600 flex justify-center items-center p-2 rounded-md shadow-md"
                  onClick={() => {
                    onSubmit({
                      title: itemMap.procedure_name,
                      description: itemMap.abbreviation,
                      color: itemMap.color_code,
                      annotation: annotation,
                      id: itemMap._id,
                      icon:
                        itemMap.icon === undefined || itemMap.icon === null
                          ? "/images/default_tooth.png"
                          : itemMap.icon,
                    });
                  }}
                >
                  <Image
                    src={
                      itemMap.icon === undefined || itemMap.icon === null
                        ? "/images/default_tooth.png"
                        : itemMap.icon
                    }
                    alt="Icon"
                    height={25}
                    width={25}
                    className=" rounded-full flex justify-center aspect-square"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=" flex flex-col items-center">
      <div
        className={twMerge(
          "h-full w-full [&>div]:h-full [&>div]:w-full max-h-[20rem] max-w-[20rem]",
          className
        )}
        {...rest}
      >
        <Annotation
          src={image}
          alt="Tooth"
          annotations={annotations}
          type={"POINT"}
          value={annotation}
          onChange={onChange}
          renderEditor={renderEditor}
          renderContent={RenderContent}
          disableOverlay
          renderHighlight={renderHighlight}
          renderSelector={renderSelector}
          className="h-full"
          disableAnnotation={disabled}
          activeAnnotation={[1]}
        />
      </div>
      {forModal && (
        <div className=" w-full flex justify-between mt-5">
          {pageType === "view" && form_id ? (
            <div></div>
          ) : (
            <div>
              <Button appearance="primary" onClick={ResetProcedures}>
                Reset Procedure
              </Button>
            </div>
          )}
          <div>
            <Button appearance="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Annotate;
