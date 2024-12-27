"use client";
import * as Y from "yjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Markdown from "react-markdown";

import { useState, useTransition } from "react";
import { BotIcon } from "lucide-react";

type Language =
  | "english"
  | "spanish"
  | "french"
  | "german"
  | "chinese"
  | "japanese"
  | "korean"
  | "arabic"
  | "russian"
  | "portuguese"
  | "italian"
  | "dutch"
  | "turkish"
  | "polish"
  | "indonesian"
  | "vietnamese"
  | "thai"
  | "swedish"
  | "czech"
  | "danish"
  | "finnish"
  | "norwegian"
  | "hungarian"
  | "greek"
  | "romanian"
  | "catalan"
  | "hebrew"
  | "hindi"
  | "bengali";

const languages: Language[] = [
  "english",
  "spanish",
  "french",
  "german",
  "chinese",
  "japanese",
  "korean",
  "arabic",
  "russian",
  "portuguese",
  "italian",
  "dutch",
  "turkish",
  "polish",
  "indonesian",
  "vietnamese",
  "thai",
  "swedish",
  "czech",
  "danish",
  "finnish",
  "norwegian",
  "hungarian",
  "greek",
  "romanian",
  "catalan",
  "hebrew",
  "hindi",
  "bengali",
];

function TranslateDocument({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("");
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");
  const [isPending, startTransition] = useTransition();

  const parseDocumentContent = (documentData: string): string => {
    try {
      // Create a DOMParser instance
      const parser = new DOMParser();
      // Parse the input string as XML
      const doc = parser.parseFromString(documentData, "application/xml");

      // Check for parsing errors
      const parseError = doc.querySelector("parsererror");
      if (parseError) {
        throw new Error("Error parsing document content.");
      }

      // Extract <heading> nodes
      const headings = Array.from(doc.getElementsByTagName("heading")).map(
        (node) => node.textContent?.trim() || ""
      );

      // Extract <bulletlistitem> nodes
      const bulletItems = Array.from(
        doc.getElementsByTagName("bulletlistitem")
      ).map((node) => node.textContent?.trim() || "");

      // Extract <paragraph> nodes
      const paragraphs = Array.from(doc.getElementsByTagName("paragraph")).map(
        (node) => node.textContent?.trim() || ""
      );

      // Extract <table> nodes
      const tables = Array.from(doc.getElementsByTagName("table")).map(
        (tableNode) => {
          const rows = Array.from(
            tableNode.getElementsByTagName("tablerow")
          ).map((rowNode) => {
            const cells = Array.from(
              rowNode.getElementsByTagName("tablecell")
            ).map((cellNode) => {
              const cellContent = Array.from(
                cellNode.getElementsByTagName("tableparagraph")
              ).map((paragraphNode) => paragraphNode.textContent?.trim() || "");
              return cellContent.join(" "); // Combine all text within a cell
            });
            return cells.join(" | "); // Format row as a pipe-separated string
          });
          return rows.join("\n"); // Combine rows with newlines
        }
      );

      // Combine and format the extracted text
      const formattedText = [
        ...headings.map((heading) => `**${heading}**`), // Format headings as bold
        ...bulletItems.map((item) => `- ${item}`), // Format bullet list items with "-"
        ...paragraphs.filter(Boolean), // Include non-empty paragraphs
        ...tables, // Add tables
      ].join("\n\n");

      return formattedText;
    } catch (error) {
      console.error("Failed to parse document content:", error);
      return "";
    }
  };

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const documentData = parseDocumentContent(
        doc.get("document-store").toString()
      );
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentData,
            targetLang: language,
          }),
        }
      );
      if (res.ok) {
        const { translated_text } = await res.json();
        setSummary(translated_text);
        toast.success("Document translated successfully!");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild onClick={() => setIsOpen(!isOpen)} variant="outline">
        <DialogTrigger>Translate</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Translate and summarize this document!</DialogTitle>
          <DialogDescription>
            Make this document easier to understand by translating it to another
            language.
          </DialogDescription>
        </DialogHeader>
        {summary && (
          <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
            <div className="flex">
              <BotIcon className="w-10 flex-shrink-0" />
              <p className="font-bold">
                GPT {isPending ? "is thinking..." : "Says:"}
              </p>
            </div>
            <p>{isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}</p>
          </div>
        )}
        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language) => {
                return (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Button type="submit" disabled={!language || isPending}>
            {isPending ? "Translating..." : "Translate"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default TranslateDocument;
