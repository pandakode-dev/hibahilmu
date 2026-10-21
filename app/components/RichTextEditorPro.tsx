"use client";

import React, { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
  Table,
  Quote,
  FileCode,
} from "lucide-react";

interface RichTextProps {
  value: string;
  onChange: (html: string) => void;
}

export const RichTextEditorPro: React.FC<RichTextProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [modeHtml, setModeHtml] = useState(false);

  const eksekusiCommand = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const sisipkanHtmlKhusus = (htmlSnippet: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand("insertHTML", false, htmlSnippet);
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border-2 border-slate-300 rounded-2xl overflow-hidden bg-white focus-within:border-indigo-600 transition shadow-2xs">
      {/* Toolbar Persis Screenshot */}
      <div className="bg-slate-50 border-b border-slate-200 p-2.5 flex flex-wrap items-center gap-1.5">
        <select
          onChange={(e) => eksekusiCommand("formatBlock", e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-xs font-bold text-slate-800"
          defaultValue="P"
        >
          <option value="P">Paragraf</option>
          <option value="H2">Judul Besar (H2)</option>
          <option value="H3">Subjudul (H3)</option>
          <option value="PRE">Blok Kode</option>
        </select>

        <div className="h-5 w-px bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => eksekusiCommand("bold")}
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-700 font-bold"
          title="Tebal (Bold)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("italic")}
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-700"
          title="Miring (Italic)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("underline")}
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-700"
          title="Garis Bawah"
        >
          <Underline className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => eksekusiCommand("justifyLeft")}
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-700"
          title="Rata Kiri"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("justifyCenter")}
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-700"
          title="Rata Tengah"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("justifyRight")}
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-700"
          title="Rata Kanan"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => eksekusiCommand("insertUnorderedList")}
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-700"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("insertOrderedList")}
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-700"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-300 mx-1" />

        {/* Tombol Stabilo Kuning */}
        <button
          type="button"
          onClick={() => eksekusiCommand("hiliteColor", "#fef08a")}
          className="px-2.5 py-1 bg-amber-300 hover:bg-amber-400 text-slate-900 rounded-md text-xs font-black"
          title="Stabilo Teks Penting"
        >
          Stabilo
        </button>

        <button
          type="button"
          onClick={() => {
            const url = prompt("Masukkan URL Tautan:", "https://");
            if (url) eksekusiCommand("createLink", url);
          }}
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-700"
          title="Sisipkan Link"
        >
          <Link2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            const url = prompt("Masukkan URL Gambar Ilustrasi:", "https://");
            if (url) {
              sisipkanHtmlKhusus(
                `<img src="${url}" alt="Ilustrasi Materi" style="max-width:100%;border-radius:12px;margin:10px 0;" />`
              );
            }
          }}
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-700"
          title="Sisipkan Gambar"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() =>
            sisipkanHtmlKhusus(
              `<table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:14px;"><thead><tr style="background:#f1f5f9;"><th style="border:1px solid #cbd5e1;padding:8px;">Konsep</th><th style="border:1px solid #cbd5e1;padding:8px;">Penjelasan</th></tr></thead><tbody><tr><td style="border:1px solid #cbd5e1;padding:8px;">Poin 1</td><td style="border:1px solid #cbd5e1;padding:8px;">Isi penjelasan</td></tr></tbody></table><p></p>`
            )
          }
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-700"
          title="Sisipkan Tabel"
        >
          <Table className="w-4 h-4" />
        </button>

        {/* Tombol Callout Box */}
        <button
          type="button"
          onClick={() =>
            sisipkanHtmlKhusus(
              `<div style="background:#eef2ff;border-left:4px solid #4f46e5;padding:12px 16px;border-radius:8px;margin:10px 0;color:#1e1b4b;font-weight:600;">💡 <b>Catatan Penting:</b> Tuliskan poin utama atau rumus kunci di sini...</div><p></p>`
            )
          }
          className="px-2.5 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 rounded-md text-xs font-black flex items-center gap-1"
          title="Sisipkan Kotak Callout"
        >
          <Quote className="w-3 h-3" /> Callout
        </button>

        <button
          type="button"
          onClick={() => setModeHtml(!modeHtml)}
          className={`ml-auto px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${
            modeHtml ? "bg-indigo-600 text-white" : "bg-white text-slate-600 border"
          }`}
        >
          <FileCode className="w-3.5 h-3.5" /> {modeHtml ? "Visual" : "HTML"}
        </button>
      </div>

      {modeHtml ? (
        <textarea
          rows={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 focus:outline-none"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: value }}
          className="w-full min-h-[160px] p-4 bg-white text-slate-800 text-sm leading-relaxed focus:outline-none prose prose-sm max-w-none"
        />
      )}
    </div>
  );
};