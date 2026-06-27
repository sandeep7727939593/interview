import { redirect } from "next/navigation";

// /questions has no slug — send visitors to the "all" view.
export default function QuestionsIndex() {
  redirect("/questions/all");
}
