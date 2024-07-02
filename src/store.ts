import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type FileState = {
  file: File | null;
  setFile: (file: File | null) => void;
};

const useFileStore = create<FileState>()(
  immer((set) => ({
    file: null,

    setFile: (file: File | null) => {
      set((state) => {
        state.file = file;
      });
    },
  }))
);

export { type FileState, useFileStore };
