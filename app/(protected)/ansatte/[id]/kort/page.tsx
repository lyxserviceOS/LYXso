import { Metadata } from "next";
import EmployeeCardPage from "../EmployeeCardPage";

export const metadata: Metadata = {
  title: "Ansattkort | LYXso",
  description: "Digitalt ansattkort",
};

export default function Page({ params }: { params: { id: string } }) {
  return <EmployeeCardPage employeeId={params.id} />;
}
