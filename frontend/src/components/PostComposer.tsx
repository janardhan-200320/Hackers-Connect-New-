import { useState } from "react";
import CodeEditor from "./CodeEditor";
import { toast } from "sonner";

export default function PostComposer() {
  const [text, setText] = useState("");
  const [code, setCode] = useState("");

  const submit = () => {
    toast("Posted!", { description: "Your writeup has been published." });
    setText("");
    setCode("");
  };

  return (
    <div className="rounded-2xl border border-zinc-400/30 bg-cyber-panel p-3 space-y-3 shadow-glow">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share a finding, PoC, or writeup..."
        className="w-full bg-transparent outline-none resize-none h-20"
      />
      <CodeEditor value={code} onChange={setCode} />
      <div className="flex justify-end">
        <button
          onClick={submit}
          className="px-3 py-2 rounded-xl border border-zinc-400/40 hover:shadow-glow"
        >
          Publish
        </button>
      </div>
    </div>
  );
}
