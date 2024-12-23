"use client";
import { useState, useEffect } from "react";
import Document from "@/components/Document";

function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    params.then((data) => setId(data.id));
  }, [params]);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={id || ""} />
    </div>
  );
}
export default DocumentPage;
