import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import NoteClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

interface NotesPageProps {
  searchParams?: Promise<{ page?: string }>;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { page: pageStr } = searchParams ? await searchParams : { page: "1" };
  const currentPage = Number(pageStr) || 1;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", currentPage, { debouncedSearch: "" }],
    queryFn: () => fetchNotes("", currentPage),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteClient />
    </HydrationBoundary>
  );
}
