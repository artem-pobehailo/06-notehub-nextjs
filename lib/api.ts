// lib/api.ts

import axios from "axios";
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  perPage?: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
  createdAt: string;
  updatedAt: string;
}

export interface NewNoteData {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

const BASE_URL = "https://notehub-public.goit.study/api";
const token = process.env.NEXT_PUBLIC_API_TOKEN;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export const fetchNotes = async (
  search?: string,
  page = 1,
  perPage = 12
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search && search.trim() !== "") {
    params.search = search;
  }

  const response = await api.get<FetchNotesResponse>("/notes", { params });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<{ note: Note }>(`/notes/${id}`);
  return response.data.note;
};

export const addNote = async (noteData: NewNoteData): Promise<Note> => {
  const response = await api.post<{ note: Note }>("/notes", noteData);
  return response.data.note;
};

export const getSingleNote = async (id: string): Promise<Note> => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};
