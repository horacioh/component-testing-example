import * as React from "react";
import { Form, useFetcher, useParams } from "react-router-dom";
import { Contact as ContactType, getContact, updateContact } from "../contacts";
import { QueryClient, useQuery } from "@tanstack/react-query";

const contactDetailQuery = (id: string) => ({
  queryKey: ["contacts", "detail", id],
  queryFn: async () => {
    const contact = await getContact(id);
    if (!contact) {
      throw new Response("", {
        status: 404,
        statusText: "Not Found",
      });
    }
    return contact;
  },
});

type InnerLoaderProps = {
  params: any;
};

export function loader(queryClient: QueryClient) {
  return async function innerContactLoader({ params }: InnerLoaderProps) {
    const query = contactDetailQuery(params.contactId);
    return (
      queryClient.getQueryData<ContactType>(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };
}

type InnerActionParams = {
  request: any;
  params: any;
};

export function action(queryClient: QueryClient) {
  return async function innerContactAction({
    request,
    params,
  }: InnerActionParams) {
    let formData = await request.formData();
    const contact = await updateContact(params.contactId, {
      favorite: formData.get("favorite") === "true",
    });
    await queryClient.invalidateQueries(["contacts"]);
    return contact;
  };
}

export default function Contact() {
  const params = useParams();
  console.log("params:", params);

  const { data: contact } = useQuery(contactDetailQuery(params.contactId));

  if (!contact) return null;

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar} />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              // eslint-disable-next-line no-restricted-globals
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }: { contact: ContactType }) {
  const fetcher = useFetcher();
  let favorite = contact.favorite;
  if (fetcher.formData) {
    favorite = fetcher.formData.get("favorite") === "true";
  }

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
