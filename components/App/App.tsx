import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";

import css from "./App.module.css";
import { fetchNotes, FetchNotesResponse } from "@/lib/api";
import Pagination from "../Pagination/Pagination";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Modal from "../Modal/Modal";
import { useDebounce } from "use-debounce";
import NoteForm from "../NoteForm/NoteForm";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", currentPage, debouncedSearchQuery],
    queryFn: () =>
      fetchNotes(debouncedSearchQuery.trim() || undefined, currentPage, 12),
    placeholderData: (prev) => prev,
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={setSearchQuery} />

        {totalPages > 1 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {notes.length > 0 && <NoteList notes={notes} />}
      {!isLoading && !isError && notes.length === 0 && <p>No notes found</p>}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onSuccess={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
