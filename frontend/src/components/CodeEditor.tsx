import Editor from "@monaco-editor/react";

export default function CodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-xl border border-zinc-400/20 overflow-hidden bg-cyber-panel">
      <Editor
        height="240px"
        language="javascript"
        value={value}
        onChange={(v) => onChange(v || "")}
      />
    </div>
  );
}
