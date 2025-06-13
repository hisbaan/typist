"use client";

import { cva } from "class-variance-authority";
import { useState, useEffect, useRef, ChangeEvent, Fragment } from "react";
import { Cursor } from "./cursor";

interface TypingProps {
  text: string;
  onStart: () => string;
  onFinish: (id: string) => void;
}

type CharStatus = "correct" | "incorrect" | undefined;

export const Typing: React.FC<TypingProps> = ({ text, onStart, onFinish }) => {
  const [input, setInput] = useState<string>("");
  const [status, setStatus] = useState<CharStatus[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const idRef = useRef<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setStatus([]);
          setInput("");
          inputRef.current?.focus();
          startedRef.current = false;
          return;
      }

      if (!startedRef.current) {
        idRef.current = onStart();
        startedRef.current = true;
      }

      return;
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    inputRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onStart]);

  const deleteMultipleSpaces = (value: string) => {
    const numSpacesToDelete = (() => {
      for (let i = value.length - 1; i > 0; i--) {
        if (value[i] !== "@") {
          return value.length - i - 1;
        }
      }
      return undefined;
    })();

    if (!numSpacesToDelete) {
      return;
    }
    setStatus((status) => [...status.slice(0, -numSpacesToDelete - 1)]);
    setInput(value.slice(0, -numSpacesToDelete));
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // TODO don't assume only one character is added/deleted (think ctrl + backspace)
    const action = value.length > input.length ? "ADDED" : "DELETED";

    if (action === "DELETED") {
      if (
        input.at(value.length) === " " &&
        input.at(value.length - 1) === "@"
      ) {
        deleteMultipleSpaces(value);
        return;
      }

      setStatus((status) => [...status.slice(0, -1)]);
      setInput(value);
      return;
    }

    const newInput = value.at(value.length - 1)!;
    const correspondingText = text.at(value.length - 1);

    if (newInput === " " && correspondingText !== " ") {
      const numSpacesToAdd = (() => {
        const startIndex = value.length;
        for (let i = startIndex; i < text.length; i++) {
          if (text[i] === " ") {
            return i - startIndex + 1;
          }
        }
        return undefined;
      })();

      if (numSpacesToAdd) {
        setInput(value.slice(0, -1) + "@".repeat(numSpacesToAdd) + " ");
        setStatus((status) => [
          ...status,
          ...Array(numSpacesToAdd + 1).fill("incorrect"),
        ]);
        return;
      }
    }

    if (newInput === correspondingText) {
      setStatus((status) => [...status, "correct"]);
    } else {
      setStatus((status) => [...status, "incorrect"]);
    }

    setInput(value);

    if (value.split(" ").length === words.length && idRef.current && startedRef.current) {
      onFinish(idRef.current);
      // TODO navigate to results page
    }
  };

  const words = text.split(" ");
  let inputIndex = 0;
  let textIndex = 0;

  const chars: React.ReactNode[] = [];

  if (input.length === 0) {
    chars.unshift(<Cursor key="cursor" />);
  }

  words.forEach((word) => {
    for (let i = 0; i < word.length; i++, textIndex++, inputIndex++) {
      const char = word[i];
      // if inputIndex > textIndex, we don't care about error state
      const charStatus = inputIndex > textIndex ? undefined : status[textIndex];

      chars.push(
        <span
          key={`char-${textIndex}`}
          className={cva(["select-none"], {
            variants: {
              status: {
                correct: ["text-neutral-300"],
                incorrect: ["text-red-300"],
                undefined: ["text-neutral-600"],
              },
            },
          })({ status: charStatus })}
        >
          {char}
        </span>,
      );

      if (chars.length === input.length) {
        chars.push(<Cursor key={`cursor-${chars.length}-${input.length}`} />);
      }
    }

    let extraChars = "";
    while (inputIndex < input.length && input[inputIndex] !== " ") {
      extraChars += input[inputIndex];
      inputIndex++;
    }

    for (let i = 0; i < extraChars.length; i++) {
      chars.push(
        <span
          key={`extra-${textIndex + i}`}
          className="text-red-300 select-none"
        >
          {extraChars[i]}
        </span>,
      );

      if (chars.length === input.length) {
        chars.push(<Cursor key={`cursor-${chars.length}`} />);
      }
    }

    chars.push(
      <Fragment key={`space-${textIndex}`}>
        <span className="whitespace-pre select-none"> </span>
        <wbr />
      </Fragment>,
    );

    if (chars.length === input.length) {
      chars.push(<Cursor key={`cursor-${chars.length}`} />);
    }

    textIndex++;
    inputIndex++;
  });

  return (
    <div
      className="relative w-full max-w-[600px] mx-20 my-auto font-mono text-lg flex flex-col gap-2"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="w-full h-full pointer-events-none text-neutral-600">
        {input.split(" ").length - 1}/{text.split(" ").length}
      </div>

      <div className="relative whitespace-pre-wrap rounded min-h-[100px] bg-transparent text-black select-none cursor-text font-normal break-words">
        {chars}
      </div>

      <textarea
        ref={inputRef}
        value={input}
        onChange={handleChange}
        className="absolute top-0 left-0 w-full h-full opacity-0 resize-none border-0 outline-none text-[20px] font-mono leading-[1.5] px-3 py-2 box-border cursor-text appearance-none"
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        data-gramm="false"
        data-gramm_editor="false"
      />
    </div>
  );
};
