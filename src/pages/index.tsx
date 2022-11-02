import Head from "next/head";
import Image from "next/image";
import { PageContainer } from "../components/animation";
import DatePicker from "../components/DatePicker";

export default function Dashboard() {
  return (
    <PageContainer>
      <div className="flex justify-between align-middle">
        <h1>Dashboard</h1>
        <div>
          <DatePicker />
        </div>
      </div>
    </PageContainer>
  );
}
