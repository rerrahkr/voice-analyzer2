import FileOpenOutlinedIcon from "@mui/icons-material/FileOpenOutlined";
import type { ButtonProps } from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import type React from "react";
import { useEffect, useRef } from "react";

type FileInputButtonProps = {
  /** Acceptable file type(s). */
  accept: string | string[];
  /** Whether this allows select multiple files. */
  multiple?: boolean;
  /** Whether this calls change event even if you select the same file. */
  forceChange?: boolean;
  /** Change event handler for input element. */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
} & Omit<ButtonProps, "onChange">;

export function FileInputButton({
  accept,
  multiple,
  forceChange,
  onClick,
  onChange,
  ...buttonProps
}: FileInputButtonProps): React.JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!forceChange) {
      return;
    }

    // Clear files after click input element.
    function handleInputClick() {
      const input = inputRef.current;
      if (!input) {
        return;
      }
      input.value = "";
    }

    inputRef.current?.addEventListener("click", handleInputClick);

    return () => {
      inputRef.current?.removeEventListener("click", handleInputClick);
    };
  }, [forceChange]);

  function handleButtonClick(ev: React.MouseEvent<HTMLButtonElement>) {
    inputRef.current?.click();
    if (onClick) {
      onClick(ev);
    }
  }

  const acceptProp: string = Array.isArray(accept)
    ? accept.reduce((prev, curr) => `${prev},${curr}`)
    : accept;

  return (
    <>
      <input
        type="file"
        hidden
        ref={inputRef}
        accept={acceptProp}
        multiple={multiple}
        onChange={onChange}
      />
      <IconButton onClick={handleButtonClick} {...buttonProps}>
        <FileOpenOutlinedIcon />
      </IconButton>
    </>
  );
}
