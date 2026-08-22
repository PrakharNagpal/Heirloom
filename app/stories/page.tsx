import { redirect } from "next/navigation";

/** The Stories tab is the saved list, which lives on Home. */
export default function Stories() {
  redirect("/#saved");
}
