"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { Send, Paperclip, X, FileText, Loader2 } from "lucide-react";
import { formatFileSize } from "@/utils/mediaHelper";
import socket from "@/socket/socketConfig";

interface ChatInputBarProps {
  onSendMessage: (text: string, file: File | null) => void;
  isSending: boolean;
  conversation_id: number;
}

export default function ChatInputBar({
  onSendMessage,
  isSending,
  conversation_id,
}: ChatInputBarProps) {
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const typingEvent = (_type: boolean) => {};
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() && !selectedFile) return;

    onSendMessage(text.trim(), selectedFile);

    setText("");
    removeSelectedFile();
  };

  const handleWrite = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    if (text.length < 1) {
      typingEvent(true);
    }
    setText(e.target.value);
  };
  return (
    <div className="flex flex-col bg-white border-t border-gray-100">
      {selectedFile && (
        <div className="px-4 py-2 bg-white border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            {filePreview ? (
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                <Image
                  src={filePreview}
                  alt="Preview"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-gray-800 truncate">
                {selectedFile.name}
              </p>
              <p className="text-[10px] text-gray-400">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          </div>
          <button
            onClick={removeSelectedFile}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSend} className="p-3 flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <input
          type="text"
          value={text}
          onChange={(e) => handleWrite(e)}
          onBlur={() => typingEvent(false)}
          onFocus={() => {
            if (text.length > 0) {
              typingEvent(true);
            }
          }}
          placeholder="Type a message..."
          className="flex-1 bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white text-xs text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none transition-all"
        />

        <button
          type="submit"
          disabled={isSending || (!text.trim() && !selectedFile)}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}
