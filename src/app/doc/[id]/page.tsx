"use client";
import { useState, useEffect, use } from "react";
import Document from "@/components/Document";

function DocumentPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    setId(params.id);
  }, [params]);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={id || ""} />
    </div>
  );
}
export default DocumentPage;
