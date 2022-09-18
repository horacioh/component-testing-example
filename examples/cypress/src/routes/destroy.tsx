import { QueryClient } from "@tanstack/react-query";
import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

export function action(queryClient: QueryClient) {
  return async function innerDestroyAction({ params }) {
    await deleteContact(params.contactId);
    queryClient.invalidateQueries(["contacts"]);
    return redirect("/");
  };
}
