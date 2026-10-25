"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Palette,
  Type,
  Info,
  Lightbulb,
  AlertTriangle,
  LayoutTemplate,
} from "lucide-react";

interface RichTextProps {
  value: string;
  onChange: (html: string) => void;
}

export const RichTextEditorPro: React.FC<RichTextProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [modeHtml, setModeHtml] = useState(false);
  const isInternalChange = useRef(false);

  // Sinkronisasi nilai dari luar jika props value berubah, tanpa merusak posisi kursor saat diketik
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const eksekusiCommand = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const sisipkanHtmlKhusus = (htmlSnippet: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand("insertHTML", false, htmlSnippet);
      handleInput();
    }
  };

  return (
    <div className="border-2 border-slate-300 rounded-2xl overflow-hidden bg-white focus-within:border-indigo-600 transition shadow-2xs">
      {/* Toolbar Editor */}
      <div className="bg-slate-50 border-b border-slate-200 p-2.5 flex flex-wrap items-center gap-1.5">
        {/* Dropdown Blok Tag */}
        <select
          onChange={(e) => eksekusiCommand("formatBlock", e.target.value)}
          className="px-2.5 py-1 border border-slate-300 rounded-lg bg-white text-xs font-bold text-slate-800"
          defaultValue="P"
        >
          <option value="P">Paragraf</option>
          <option value="H2">Judul Besar (H2)</option>
          <option value="H3">Subjudul (H3)</option>
          <option value="PRE">Blok Kode</option>
        </select>

        {/* Dropdown Ukuran Teks */}
        <select
          onChange={(e) => eksekusiCommand("fontSize", e.target.value)}
          className="px-2.5 py-1 border border-slate-300 rounded-lg bg-white text-xs font-bold text-slate-800"
          defaultValue="3"
          title="Ukuran Teks"
        >
          <option value="1">Kecil Sekali</option>
          <option value="2">Kecil</option>
          <option value="3">Normal</option>
          <option value="4">Besar</option>
          <option value="5">Sangat Besar</option>
        </select>

        <div className="h-5 w-px bg-slate-300 mx-1" />

        {/* Format Dasar */}
        <button
          type="button"
          onClick={() => eksekusiCommand("bold")}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 font-bold"
          title="Tebal (Bold)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("italic")}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"
          title="Miring (Italic)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("underline")}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"
          title="Garis Bawah"
        >
          <Underline className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-300 mx-1" />

        {/* Warna Teks */}
        <div className="flex items-center gap-1" title="Warna Teks">
          <Palette className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="color"
            onChange={(e) => eksekusiCommand("foreColor", e.target.value)}
            className="w-5 h-5 rounded border-0 cursor-pointer bg-transparent"
            title="Pilih Warna Teks"
          />
        </div>

        {/* Pilihan Warna Stabilo */}
        <div className="flex items-center gap-1 ml-1">
          <button
            type="button"
            onClick={() => eksekusiCommand("hiliteColor", "#fef08a")}
            className="w-4 h-4 rounded-full bg-yellow-200 border border-yellow-400 hover:scale-110 transition"
            title="Stabilo Kuning"
          />
          <button
            type="button"
            onClick={() => eksekusiCommand("hiliteColor", "#bbf7d0")}
            className="w-4 h-4 rounded-full bg-green-200 border border-green-400 hover:scale-110 transition"
            title="Stabilo Hijau"
          />
          <button
            type="button"
            onClick={() => eksekusiCommand("hiliteColor", "#bfdbfe")}
            className="w-4 h-4 rounded-full bg-blue-200 border border-blue-400 hover:scale-110 transition"
            title="Stabilo Biru"
          />
        </div>

        <div className="h-5 w-px bg-slate-300 mx-1" />

        {/* Perataan Teks */}
        <button
          type="button"
          onClick={() => eksekusiCommand("justifyLeft")}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"
          title="Rata Kiri"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("justifyCenter")}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"
          title="Rata Tengah"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("justifyRight")}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"
          title="Rata Kanan"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-300 mx-1" />

        {/* Bullet & Numbered List (Diperbaiki agar style list tampil jelas) */}
        <button
          type="button"
          onClick={() => eksekusiCommand("insertUnorderedList")}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 flex items-center gap-1 font-bold text-xs"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => eksekusiCommand("insertOrderedList")}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700 flex items-center gap-1 font-bold text-xs"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-slate-300 mx-1" />

        {/* Tombol Kotak Khusus: Info, Tips, Peringatan */}
        <button
          type="button"
          onClick={() =>
            sisipkanHtmlKhusus(
              `<div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:12px 16px;border-radius:8px;margin:10px 0;color:#1e3a8a;font-size:14px;">ℹ️ <b>Informasi Penting:</b> Tuliskan catatan informasi di sini...</div><p></p>`
            )
          }
          className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md text-xs font-black flex items-center gap-1"
          title="Kotak Info"
        >
          <Info className="w-3 h-3" /> Info
        </button>

        <button
          type="button"
          onClick={() =>
            sisipkanHtmlKhusus(
              `<div style="background:#fefce8;border-left:4px solid #eab308;padding:12px 16px;border-radius:8px;margin:10px 0;color:#713f12;font-size:14px;">💡 <b>Tips Belajar:</b> Tuliskan tips atau trik cepat di sini...</div><p></p>`
            )
          }
          className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-md text-xs font-black flex items-center gap-1"
          title="Kotak Tips"
        >
          <Lightbulb className="w-3 h-3" /> Tips
        </button>

        <button
          type="button"
          onClick={() =>
            sisipkanHtmlKhusus(
              `<div style="background:#fff1f2;border-left:4px solid #f43f5e;padding:12px 16px;border-radius:8px;margin:10px 0;color:#881337;font-size:14px;">⚠️ <b>Peringatan / Catatan Kritis:</b> Tuliskan peringatan penting di sini...</div><p></p>`
            )
          }
          className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-md text-xs font-black flex items-center gap-1"
          title="Kotak Peringatan"
        >
          <AlertTriangle className="w-3 h-3" /> Peringatan
        </button>

        {/* Tombol Template Struktur Materi Cepat */}
        <button
          type="button"
          onClick={() =>
            sisipkanHtmlKhusus(
              `<h3>🎯 Tujuan Pembelajaran</h3><ul><li>Siswa mampu memahami konsep dasar...</li><li>Siswa dapat mengimplementasikan...</li></ul><h3>📖 Materi Utama</h3><p>Tuliskan uraian materi pembelajaran di sini...</p><h3>📝 Kesimpulan</h3><p>Kesimpulan dari modul pembelajaran ini adalah...</p><p></p>`
            )
          }
          className="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-md text-xs font-black flex items-center gap-1"
          title="Template Struktur Materi Siap Pakai"
        >
          <LayoutTemplate className="w-3 h-3" /> Template Materi
        </button>

        <div className="h-5 w-px bg-slate-300 mx-1" />

        <button
          type="button"
          onClick={() => {
            const url = prompt("Masukkan URL Tautan:", "https://");
            if (url) eksekusiCommand("createLink", url);
          }}
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"
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
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"
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
          className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-700"
          title="Sisipkan Tabel"
        >
          <Table className="w-4 h-4" />
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

      {/* Area Editor / HTML Source Code */}
      {modeHtml ? (
        <textarea
          rows={7}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 focus:outline-none"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="w-full min-h-[180px] p-4 bg-white text-slate-800 text-sm leading-relaxed focus:outline-none prose prose-sm max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
        />
      )}
    </div>
  );
};