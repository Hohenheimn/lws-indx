import React, { useEffect, useState } from "react";
import { FaTooth } from "react-icons/fa";
import { GiToothbrush, GiTooth, GiSkullSabertooth } from "react-icons/gi";
import Annotation from "react-image-annotation";
import { twMerge } from "tailwind-merge";
import { PageContainer } from "@components/animation";
import { Button } from "@components/Button";
import { useQuery } from "@tanstack/react-query";
import { fetchData } from "@utilities/api";

interface AnnotateProps extends React.HTMLAttributes<HTMLDivElement> {
    disabled?: boolean;
    image: string;
    defaultValue?: any;
    UpdateToothsHandler?: Function;
    ProceduresData?: {
        abbreviation: string;
        color_code: string;
        cost: number;
        created_at: string;
        procedure_name: string;
        _id: string;
    }[];
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
                boxShadow:
                    active && "0 0 20px 20px rgba(255, 255, 255, 0.3) inset",
                background: annotation.data.color,
                position: "absolute",
                left: `${geometry.x}%`,
                top: `${geometry.y}%`,
                transform: `translate(-50%, -50%)`,
                color: "#333",
                fontWeight: 700,
            }}
        >
            <div className="text-[100%]">{annotation.data.icon}</div>
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
                // height: "10%",
                // width: "10%",
                color: "#333",
                fontWeight: 700,
                // padding: "1rem",
                // zIndex: 10000000000
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
    ...rest
}: AnnotateProps) {
    let [annotations, setAnnotations] = React.useState<any>([]);
    let [annotation, setAnnotation] = React.useState({});

    useEffect(() => {
        setAnnotations(
            defaultValue?.annotations === undefined
                ? []
                : defaultValue?.annotations
        );
    }, [defaultValue]);

    // console.log(annotations, "anos", annotation, "ano");

    function onChange(annotation: any) {
        setAnnotation(annotation);
    }

    function onSubmit({
        title,
        description,
        color,
        icon,
        annotation,
        id,
    }: any) {
        const { geometry, data }: any = annotation;

        setAnnotation({});
        setAnnotations(
            annotations.concat({
                key: annotations.length + 1,
                geometry,
                data: {
                    ...data,
                    title,
                    description,
                    color,
                    icon,
                    procedure_id: id,
                },
            })
        );
        if (UpdateToothsHandler !== undefined) {
            UpdateToothsHandler(
                defaultValue.tooth_no,
                defaultValue.tooth_position,
                annotations.concat({
                    key: annotations.length + 1,
                    geometry,
                    data: {
                        ...data,
                        title,
                        description,
                        color,
                        icon,
                        procedure_id: id,
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
                    // transform: `translate(-${geometry.x}%, -${geometry.y}%)`,
                    height: `10%`,
                    width: `10%`,
                    // padding: "7.5%",
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
                        // width: "10rem",
                    }}
                >
                    <div className="grid grid-cols-3 gap-4 w-80">
                        {ProceduresData?.map((itemMap, index) => (
                            <div key={index}>
                                <Button
                                    appearance="primary"
                                    onClick={() => {
                                        onSubmit({
                                            title: itemMap.procedure_name,
                                            description: itemMap.abbreviation,
                                            color: itemMap.color_code,
                                            annotation: annotation,
                                            id: itemMap._id,
                                            icon: (
                                                <GiSkullSabertooth className="text-[inherit]" />
                                            ),
                                        });
                                    }}
                                >
                                    <GiSkullSabertooth className="text-[inherit]" />
                                </Button>
                            </div>
                        ))}

                        {/* <Button appearance="primary">Pasta</Button>
            <Button appearance="primary">Extraction</Button> */}
                    </div>
                    {/* <div>A</div>
          <Input
            onChange={(e: any) => {
              setTitle(e.target.value);
            }}
          />
          <TextArea
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <Button onClick={() => onSubmit(annotation, { title, description })}>
            Submit
          </Button> */}
                </div>
            </div>
        );
    }

    return (
        <div
            className={twMerge(
                "h-full w-full [&>div]:h-full [&>div]:w-full",
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
    );
}

export default Annotate;
