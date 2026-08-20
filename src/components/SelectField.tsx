"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  ariaLabel?: string;
  ariaInvalid?: boolean;
  ariaDescribedby?: string;
  className?: string;
}

function ChevronIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0 text-ink-700/50">
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0 text-sunset-500">
      <path
        d="M4 10.5L8 14.5L16 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function SelectField({
  id,
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
  ariaInvalid,
  ariaDescribedby,
  className = "",
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const title = ariaLabel ?? placeholder;

  function handleSelect(next: string) {
    onChange(next);
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <div className={className}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-describedby={ariaDescribedby}
        data-empty={!selected}
        data-invalid={ariaInvalid}
        className="picker-trigger"
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <ChevronIcon />
      </button>

      {mounted &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
            <div
              className="absolute inset-0 animate-sheet-backdrop bg-ink-900/40"
              onClick={() => setOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              className="relative flex max-h-[70vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl animate-sheet-up sm:max-w-sm sm:animate-sheet-pop sm:rounded-3xl"
            >
              <div className="flex items-center justify-between border-b border-ink-900/10 px-5 py-4">
                <p className="text-[15px] font-semibold text-ink-900">{title}</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="닫기"
                  className="focus-ring flex h-8 w-8 items-center justify-center rounded-full text-ink-700/50 hover:bg-cream-100 hover:text-ink-800"
                >
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                    <path
                      d="M5 5L15 15M15 5L5 15"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <ul className="overflow-y-auto py-1">
                {options.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() => handleSelect(option.value)}
                        data-selected={isSelected}
                        className="picker-option"
                      >
                        {option.label}
                        {isSelected && <CheckIcon />}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div
                className="border-t border-ink-900/10 p-3 sm:hidden"
                style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="focus-ring flex min-h-[44px] w-full items-center justify-center rounded-xl bg-cream-100 text-sm font-semibold text-ink-700"
                >
                  취소
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
