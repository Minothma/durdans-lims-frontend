import { redirect } from "next/navigation";

export default function VerificationRoot() {
  redirect("/verification/pending");
}