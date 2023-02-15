import { AnimateContainer } from "../../components/animation";
import { fadeIn } from "../../components/animation/animation";
import ChangeHistory from "./ChangeHistory";
import Charting from "./Charting";
import DentalHistory from "./DentalHistory";
import MedicalGallery from "./MedicalGallery";
import MedicalHistory from "./MedicalHistory";
import PersonalInfo from "./PersonalInfo";
import PersonalRecord from "./PersonalRecord";
import Prescription from "./Prescription";
import TreatmentPlan from "./TreatmentPlan";
import TreatmentRecords from "./TreatmentRecords";

export const patientRecord = (patientRecord: any) => [
  {
    label: `Personal Record`,
    key: "1",
    children: (
      <AnimateContainer
        variants={fadeIn}
        key={1}
        className="flex flex-col flex-auto"
      >
        <PersonalRecord patientRecord={patientRecord} />
      </AnimateContainer>
    ),
  },
  {
    label: `Personal Info`,
    key: "2",
    children: (
      <AnimateContainer
        variants={fadeIn}
        key={2}
        className="flex flex-col flex-auto"
      >
        <PersonalInfo patientRecord={patientRecord} />
      </AnimateContainer>
    ),
  },
  {
    label: `Dental History`,
    key: "3",
    children: (
      <AnimateContainer
        variants={fadeIn}
        key={3}
        className="flex flex-col flex-auto"
      >
        <DentalHistory patientRecord={patientRecord} />
      </AnimateContainer>
    ),
  },
  {
    label: `Medical History`,
    key: "4",
    children: (
      <AnimateContainer
        variants={fadeIn}
        key={4}
        className="flex flex-col flex-auto"
      >
        <MedicalHistory patientRecord={patientRecord} />
      </AnimateContainer>
    ),
  },
  {
    label: `Treatment Plan`,
    key: "5",
    children: (
      <AnimateContainer
        variants={fadeIn}
        key={5}
        className="flex flex-col flex-auto"
      >
        <TreatmentPlan patientRecord={patientRecord} />
      </AnimateContainer>
    ),
  },
  {
    label: `Charting`,
    key: "6",
    children: (
      <AnimateContainer
        variants={fadeIn}
        key={6}
        className="flex flex-col flex-auto"
      >
        <Charting patientRecord={patientRecord} />
      </AnimateContainer>
    ),
  },
  {
    label: `Treatment Records`,
    key: "7",
    children: (
      <AnimateContainer
        variants={fadeIn}
        key={7}
        className="flex flex-col flex-auto"
      >
        <TreatmentRecords patientRecord={patientRecord} />
      </AnimateContainer>
    ),
  },
  {
    label: `Medical Gallery`,
    key: "8",
    children: (
      <AnimateContainer
        variants={fadeIn}
        key={8}
        className="flex flex-col flex-auto"
      >
        <MedicalGallery patientRecord={patientRecord} />
      </AnimateContainer>
    ),
  },
  {
    label: `Prescription`,
    key: "9",
    children: (
      <AnimateContainer
        variants={fadeIn}
        key={9}
        className="flex flex-col flex-auto"
      >
        <Prescription patientRecord={patientRecord} />
      </AnimateContainer>
    ),
  },
  {
    label: `Change History`,
    key: "10",
    children: (
      <AnimateContainer
        variants={fadeIn}
        key={10}
        className="flex flex-col flex-auto"
      >
        <ChangeHistory patientRecord={patientRecord} />
      </AnimateContainer>
    ),
  },
];

export default patientRecord;
