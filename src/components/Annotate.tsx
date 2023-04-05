import React from "react";
import Annotation from "react-image-annotation";
import { Button } from "../components/Button";
import { PageContainer } from "../components/animation";
import { GiToothbrush, GiTooth, GiSkullSabertooth } from "react-icons/gi";
import { FaTooth } from "react-icons/fa";
import { twMerge } from "tailwind-merge";

interface AnnotateProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  image: string;
  defaultValue?: any;
}

const Shape = ({ children, geometry, style }: any) => {
  return (
    <div
      style={{
        ...style,
        // height: `${geometry.height}%`,
        // width: `${geometry.width}%`,
        height: `1rem`,
        width: `1rem`,
        borderRadius: geometry.type === "POINT" ? "100%" : 0,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // padding: "1rem",
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
        left: `calc(${geometry.x}% - .7rem)`,
        top: `calc(${geometry.y}% - .7rem)`,
        color: "#333",
        fontWeight: 700,
        // padding: "1rem",
        padding: ".6rem",
        // zIndex: 10000000000
      }}
    >
      <div className="text-[.6rem]">{annotation.data.icon}</div>
    </Shape>
  );
}

function RenderContent({ annotation, key }: any) {
  const { geometry } = annotation;

  if (!geometry) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: `calc(${geometry.x}% - .7rem)`,
        top: `calc(${geometry.y}% - .7rem + 50%)`,
        transform: "translateX(-50%)",
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
  defaultValue = [],
  ...rest
}: AnnotateProps) {
  let [annotations, setAnnotations] = React.useState<any>(defaultValue);
  let [annotation, setAnnotation] = React.useState({});

  function onChange(annotation: any) {
    setAnnotation(annotation);
  }

  function onSubmit(annotation: any, { title, description, color, icon }: any) {
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
        },
      })
    );
  }

  function renderEditor({ annotation }: any) {
    const { geometry } = annotation;

    if (!geometry) return null;

    return (
      <div
        style={{
          left: `calc(${geometry.x}% - .7rem)`,
          top: `calc(${geometry.y}% - .7rem)`,
          height: `.5rem`,
          width: `.5rem`,
          borderRadius: geometry.type === "POINT" ? "100%" : 0,
          position: "absolute",
          zIndex: 10000,
          background: "#fff",
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
            <div>
              <Button
                appearance="primary"
                onClick={() => {
                  onSubmit(annotation, {
                    title: "Procedure 1",
                    description: "Description 1",
                    color: "green",
                    icon: <GiToothbrush className="text-[inherit]" />,
                  });
                }}
              >
                <GiToothbrush className="text-2xl" />
              </Button>
            </div>
            <div>
              <Button
                appearance="primary"
                onClick={() => {
                  onSubmit(annotation, {
                    title: "Procedure 2",
                    description: "Description 2",
                    color: "blue",
                    icon: <FaTooth className="text-[inherit]" />,
                  });
                }}
              >
                <FaTooth className="text-2xl" />
              </Button>
            </div>
            <div>
              <Button
                appearance="primary"
                onClick={() => {
                  onSubmit(annotation, {
                    title: "Procedure 3",
                    description: "Description 3",
                    color: "yellow",
                    icon: <GiTooth className="text-[inherit]" />,
                  });
                }}
              >
                <GiTooth className="text-2xl" />
              </Button>
            </div>
            <div>
              <Button
                appearance="primary"
                onClick={() => {
                  onSubmit(annotation, {
                    title: "Procedure 4",
                    description: "Description 4",
                    color: "red",
                    icon: <GiSkullSabertooth className="text-[inherit]" />,
                  });
                }}
              >
                <GiSkullSabertooth className="text-2xl" />
              </Button>
            </div>
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
        alt="Two pebbles anthropomorphized holding hands"
        annotations={annotations}
        type={"POINT"}
        value={annotation}
        onChange={onChange}
        renderEditor={renderEditor}
        renderContent={RenderContent}
        renderOverlay={() => <div></div>}
        renderHighlight={renderHighlight}
        className="h-full"
        disableAnnotation={false}
      />
    </div>
  );
}

export default Annotate;
