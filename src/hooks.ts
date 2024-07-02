import { type FileState, useFileStore } from "./store";

function useFile(): FileState["file"] {
  return useFileStore((state) => state.file);
}

function useSetFile(): FileState["setFile"] {
  return useFileStore((state) => state.setFile);
}

export { useFile, useSetFile };
