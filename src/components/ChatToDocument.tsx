"use client";
import * as Y from "yjs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import { BotIcon, MessageCircleCode } from "lucide-react";
import Markdown from "react-markdown";

function ChatToDocument({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      setQuestion(input);
      const documentData = doc.get("document-store").toString();
      const answer = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: input,
            documentData,
          }),
        }
      );
      if (answer.ok) {
        const { message } = await answer.json();
        toast.success("Document answered question!");
        setSummary(message);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild onClick={() => setIsOpen(!isOpen)} variant="outline">
        <DialogTrigger>
          <MessageCircleCode className="mr-2" />
          Chat To Document
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat with your document!</DialogTitle>
          <DialogDescription>
            Ask your document a question or chat with it.
          </DialogDescription>
          <hr className="mt-5" />
          {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
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

        <form
          onSubmit={handleAskQuestion}
          className="flex flex-col md:flex-row gap-2"
        >
          <Input
            type="text"
            placeholder="question..."
            className="w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" disabled={!input || isPending}>
            {isPending ? "Thinking..." : "Ask Question"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default ChatToDocument;
