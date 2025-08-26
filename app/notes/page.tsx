// app/notes/page.tsx

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import NoteClient from "./Notes.client";
import { fetchNotes, FetchNotesResponse } from "@/lib/api";

interface NotesPageProps {
  searchParams?: { page?: string };
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const currentPage = Number(searchParams?.page) || 1;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery<FetchNotesResponse>({
    queryKey: ["notes", currentPage, { debouncedSearchQuery: "" }],
    queryFn: () => fetchNotes("", currentPage),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteClient />
    </HydrationBoundary>
  );
}
