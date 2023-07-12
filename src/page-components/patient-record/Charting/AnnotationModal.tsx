import React from "react";
import { DatePicker, Form, notification } from "antd";
import moment from "moment";
import { scroller } from "react-scroll";
import Annotate from "@components/Annotate";
import Input from "@components/Input";
import Modal from "@components/Modal";

export default function AnnotationModal({ show, onClose, form, ...rest }: any) {
  return (
    <Modal show={show} onClose={onClose} {...rest}>
      <div className="space-y-4">
        <h1 className="text-center">1</h1>
        <div className="h-full w-full max-h-[20rem] max-w-[20rem] m-auto">
          <Annotate
            // disabled={true}
            image={`/images/tooth-periodontal.png`}
          />
        </div>
        {/* <div className="h-[25rem]">
            <Annotate
              // disabled={true}
              image={`/images/tooth-standard.png`}
            />
          </div> */}
      </div>
    </Modal>
  );
}
