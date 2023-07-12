import React from "react";
import { FaTooth } from "react-icons/fa";
import { GiToothbrush, GiTooth, GiSkullSabertooth } from "react-icons/gi";
import Annotation from "react-image-annotation";
import { PageContainer } from "@components/animation";
import Annotate from "@components/Annotate";
import { Button } from "@components/Button";

import PrivateRoute from "../../auth/HOC/PrivateRoute";
import VerifyAuth from "../../auth/HOC/VerifyAuth";

const Shape = ({ children, geometry, style }: any) => {
  return (
    <div
      style={{
        ...style,
        // height: `${geometry.height}%`,
        // width: `${geometry.width}%`,
        height: `1.5rem`,
        width: `1.5rem`,
        borderRadius: geometry.type === "POINT" ? "100%" : 0,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      {children}
    </div>
  );
};

function renderHighlight({ annotation, active }: any) {
  const { geometry } = annotation;

  if (!geometry) return null;

  let sample = (id: number) => {
    switch (id) {
      case 0:
        return "blue";
      case 1:
        return "yellow";
      case 2:
        return "red";
      case 3:
        return "black";
      default:
        return "green";
    }
  };

  return (
    <Shape
      key={annotation.data.id}
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
        fontSize: "1rem",
        padding: "1rem",
      }}
    >
      <div>{annotation.data.icon}</div>
    </Shape>
  );
}

function RenderContent({ annotation, active }: any) {
  const { geometry } = annotation;

  if (!geometry) return null;

  return (
    <div
      style={{
        left: `${geometry.x}%`,
        top: `${geometry.y}%`,
        height: `1.5rem`,
        width: `1.5rem`,
        borderRadius: geometry.type === "POINT" ? "100%" : 0,
        position: "absolute",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "120%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "10rem",
          background: "#fff",
          padding: "1rem",
          borderRadius: "1rem",
          boxShadow: "0 0 10px #ccc",
        }}
      >
        <div className="space-y-4">
          <h5>{annotation.data.title}</h5>
          <div>{annotation.data.description}</div>
        </div>
      </div>
    </div>
  );
}

export function Sample({ router }: any) {
  let [annotations, setAnnotations] = React.useState<any>([]);
  let [annotation, setAnnotation] = React.useState({});
  let [description, setDescription] = React.useState("");
  let [title, setTitle] = React.useState("");

  function onChange(annotation: any) {
    setAnnotation(annotation);
  }

  function onSubmit(annotation: any, { title, description, color, icon }: any) {
    const { geometry, data }: any = annotation;

    setAnnotation({});
    setAnnotations(
      annotations.concat({
        geometry,
        data: {
          ...data,
          title,
          description,
          color,
          icon,
          id: annotations.length + 1,
        },
      })
    );
  }

  function renderEditor({ annotation, active }: any) {
    const { geometry } = annotation;

    if (!geometry) return null;

    return (
      <div
        style={{
          left: `calc(${geometry.x}% - .7rem)`,
          top: `calc(${geometry.y}% - .7rem)`,
          height: `1.5rem`,
          width: `1.5rem`,
          borderRadius: geometry.type === "POINT" ? "100%" : 0,
          position: "absolute",
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
                    icon: <GiToothbrush />,
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
                    icon: <FaTooth />,
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
                    icon: <GiTooth />,
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
                    icon: <GiSkullSabertooth />,
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
    <PageContainer>
      <div className=" h-80 w-80 m-auto [&>div]:h-full [&>div]:w-full">
        <Annotate
          // disabled={true}
          image={`/images/tooth-periodontal.png`}
        />
      </div>
    </PageContainer>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(Sample);
