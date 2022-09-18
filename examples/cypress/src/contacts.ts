import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export type Contact = {
  id: string;
  createdAt: number;
  avatar?: string;
  favorite?: boolean;
  first?: string;
  last?: string;
  notes?: string;
  twitter?: string
}

const seed = async () => {
  const initialData: Array<Contact> = [

    {
      avatar: "https://avatars.githubusercontent.com/u/725120?v=4",
      createdAt: 1660978712047,
      favorite: false,
      first: "Horacio",
      id: "usupkc0",
      last: "Herrera",
      notes: "Created this example!",
      twitter: "@hhg2288",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/5580297",
      createdAt: 1660978713047,
      favorite: false,
      first: "Tanner",
      id: "usupkc1",
      last: "Linsley",
      notes: "Created React Query",
      twitter: "@tannerlinsley",
    },
    {
      avatar: "https://avatars.githubusercontent.com/u/1021430",
      createdAt: 1660979124264,
      favorite: false,
      first: "Dominik",
      id: "kvvztl7",
      last: "D",
      notes: "Maintains React Query",
      twitter: "@tkdodo",
    },
  ];
  const contacts = await localforage.getItem<Array<Contact>>("contacts");
  if (!contacts) {
    set(initialData);
  }
};

seed();

export async function getContacts(query?: string) {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = await localforage.getItem<Array<Contact>>("contacts");
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

export async function createContact() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let contact = { id, createdAt: Date.now() };
  let contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}

export async function getContact(id?: string) {
  await fakeNetwork(`contact:${id}`);
  let contacts = await localforage.getItem<Array<Contact>>("contacts");
  let contact = contacts?.find((contact) => contact.id === id);
  return contact ?? null;
}

export async function updateContact(id: string, updates: Partial<Contact>) {
  await fakeNetwork();
  let contacts = await localforage.getItem<Array<Contact>>("contacts");
  let contact = contacts?.find((contact) => contact.id === id);
  if (!contact) throw new Error(`No contact found for ${id}`);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}

export async function deleteContact(id: string) {
  let contacts = await localforage.getItem<Array<Contact>>("contacts");
  let index = contacts?.findIndex((contact) => contact.id === id);
  if (contacts && index && index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts: Array<Contact>) {
  return localforage.setItem("contacts", contacts);
}

async function fakeNetwork(key?: string) {
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}
