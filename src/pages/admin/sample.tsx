import React from "react";
import PrivateRoute from "../../auth/HOC/PrivateRoute";
import VerifyAuth from "../../auth/HOC/VerifyAuth";
import { NextPageProps } from "../../../utils/types/NextPageProps";
import dynamic from "next/dynamic";
import Annotation from "react-image-annotation";
import { OvalSelector } from "react-image-annotation/lib/selectors";
import Input from "../../components/Input";
import TextArea from "antd/lib/input/TextArea";
import { Button } from "../../components/Button";
import { PageContainer } from "../../components/animation";

const Shape = ({ children, geometry, style }: any) => {
  return (
    <div
      style={{
        ...style,
        height: `${geometry.height}%`,
        width: `${geometry.width}%`,
        borderRadius: geometry.type === "OVAL" ? "100%" : 0,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
        background: sample(annotation.data.id),
        position: "absolute",
        left: `${geometry.x}%`,
        top: `${geometry.y}%`,
        color: "skyblue",
        fontWeight: 700,
        fontSize: "1.5rem",
      }}
    >
      {annotation.data.id}
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
        height: `${geometry.height}%`,
        width: `${geometry.width}%`,
        borderRadius: geometry.type === "OVAL" ? "100%" : 0,
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

  function onSubmit(annotation: any, { title, description }: any) {
    const { geometry, data }: any = annotation;

    setAnnotation({});
    setAnnotations(
      annotations.concat({
        geometry,
        data: {
          ...data,
          title,
          description,
          id: annotations.length,
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
          left: `${geometry.x}%`,
          top: `${geometry.y}%`,
          height: `${geometry.height}%`,
          width: `${geometry.width}%`,
          borderRadius: geometry.type === "OVAL" ? "100%" : 0,
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
          }}
        >
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
          </Button>
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      <div className=" h-80 w-80 m-auto [&>div]:h-full [&>div]:w-full">
        <Annotation
          src="/images/tooth-periodontal.png"
          alt="Two pebbles anthropomorphized holding hands"
          annotations={annotations}
          type={"OVAL"}
          value={annotation}
          onChange={onChange}
          //   onSubmit={onSubmit}
          activeAnnotations={[true, true]}
          renderEditor={renderEditor}
          renderContent={RenderContent}
          renderOverlay={() => <div></div>}
          renderHighlight={renderHighlight}
          //   renderSelector={(e) => <div style={{}}>asdf</div>}
          className="h-full"
          //   disableAnnotation={true}
        />
      </div>
    </PageContainer>
  );
}

export const getServerSideProps = VerifyAuth((ctx, serverSideProps) => {
  return { props: { ...serverSideProps } };
});

export default PrivateRoute(Sample);
