import React, { useEffect, useRef } from "react";

export default function TrixEditor({ value, onChange, placeholder = "Tulis catatan..." }) {
    const inputRef = useRef(null);
    const editorRef = useRef(null);
    const idRef = useRef("trix-" + Math.random().toString(36).slice(2, 9));

    useEffect(() => {
        const inputEl = inputRef.current;
        const editorEl = inputEl?.nextElementSibling; // <trix-editor> follows the input
        editorRef.current = editorEl;

        if (!editorEl) return;

        const handleChange = () => {
            // the hidden input value is kept in sync by Trix
            onChange?.(inputEl.value);
        };

        editorEl.addEventListener("trix-change", handleChange);

        // Cleanup
        return () => {
            editorEl.removeEventListener("trix-change", handleChange);
        };
    }, [onChange]);

    // Keep Trix content in sync when `value` prop changes
    useEffect(() => {
        const inputEl = inputRef.current;
        const editorEl = editorRef.current;
        if (!inputEl) return;

        // Update the hidden input's value
        if (value !== undefined && value !== inputEl.value) {
            inputEl.value = value || "";
            // If the editor is initialized, load HTML into it
            if (editorEl && editorEl.editor && typeof editorEl.editor.loadHTML === "function") {
                try {
                    editorEl.editor.loadHTML(value || "");
                } catch (err) {
                    // ignore load errors
                }
            } else {
                // If editor not ready yet, dispatch an input event so Trix picks up the value
                const evt = new Event("input", { bubbles: true });
                inputEl.dispatchEvent(evt);
            }
        }
    }, [value]);

    return (
        <div className="border rounded-lg overflow-hidden">
            <input
                ref={inputRef}
                type="hidden"
                id={idRef.current}
                defaultValue={value || ""}
            />
            <trix-editor input={idRef.current} placeholder={placeholder}></trix-editor>
        </div>
    );
}
