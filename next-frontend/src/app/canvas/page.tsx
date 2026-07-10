"use client";

import { useRouter } from "next/navigation";
import { CanvasEditor } from "@/components/doodle/canvas-editor";

export default function Page() {
  const router = useRouter();

  const handleSubmit = (saveData: string) => {
    // No backend, no persistence: the drawing only ever lives in this
    // browser tab's sessionStorage, just long enough to render it on the
    // next page. It disappears entirely once the tab is closed.
    sessionStorage.setItem("lastCanvas", saveData);
    router.push("/success");
  };

  return <CanvasEditor onSubmit={handleSubmit} />;
}
