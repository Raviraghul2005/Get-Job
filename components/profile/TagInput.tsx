"use client";

import { useState } from "react";
import { X } from "lucide-react";

type TagInputProps = {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
};

export function TagInput({ tags, onTagsChange, placeholder = "Add a skill" }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  function handleAdd(): void {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
      setInputValue("");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  function handleRemove(tag: string): void {
    onTagsChange(tags.filter((t) => t !== tag));
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-surface border border-border rounded-md px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors"
        >
          Add
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 bg-surface border border-border rounded-full px-3 py-1 text-sm text-text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemove(tag)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
