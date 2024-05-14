import { HTMLInputTypeAttribute, forwardRef, useEffect, useState } from "react";

type TextFieldWithLabelProps = {
  label: string;
  placeholderText: string;
  errorText: string;
  type?: HTMLInputTypeAttribute;
  pattern: string;
  onValidText: (text: string) => void;
  onTextChange?: (text: string) => void;
  showError?: boolean;
};

const TextFieldWithLabel = forwardRef<
  HTMLInputElement,
  TextFieldWithLabelProps
>(
  (
    {
      label,
      placeholderText,
      type,
      errorText,
      pattern,
      onValidText,
      onTextChange,
      showError,
    },
    ref
  ) => {
    const [errorMessage, setErrorMessage] = useState("");

    const handleInput = () => {
      if (ref && ref.current) {
        if (onTextChange) {
          onTextChange(ref!.current.value.trim());
        }
        if (!ref.current.checkValidity()) {
          setErrorMessage(errorText);
          onValidText("");
        } else {
          setErrorMessage("");
          onValidText(ref!.current.value.trim());
        }
      }
    };

    useEffect(() => {
      if (showError && errorMessage == "") {
        setErrorMessage(errorText);
      }
    }, [showError]);

    return (
      <div className="py-2 w-full">
        <div className="mb-4">
          <label
            for="error"
            class={
              errorMessage
                ? "block mb-2 text-md font-semibold  text-red-700 dark:text-red-500"
                : "mb-2 font-semibold text-md"
            }
          >
            {label} :
          </label>

          <input
            required={true}
            ref={ref}
            type={type ?? "text"}
            pattern={pattern}
            className={
              errorMessage
                ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
                : "w-full border-red-500 p-2 mt-2 text-sm focus:outline-none focus:border-green-700 rounded-lg border-2 required:border-green-500 text-green-700"
            }
            placeholder={placeholderText}
            onInput={handleInput}
          />
          {errorMessage && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    );
  }
);

export default TextFieldWithLabel;
