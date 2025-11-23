import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextInput({ value, onChange }: TextInputProps) {
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="border-b-2 border-cyan-500/30 px-6 py-4 bg-slate-800/80 backdrop-blur-sm">
        <h2 className="text-lg font-bold text-cyan-400">Input</h2>
        <p className="text-sm text-slate-400 mt-1">
          🚀 Paste your plain text - automatic formatting applied!
        </p>
      </div>
      <div className="flex-1 p-6">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your text here...

Auto-detects:
✓ Headings (lines with 'Marks', UNIT headers, etc.)
✓ Java code (import statements, classes, methods)
✓ Lists (lines starting with -, •, numbers)
✓ Regular paragraphs

Just paste and watch the magic! ✨"
          className="h-full min-h-[500px] resize-none font-mono text-sm bg-slate-900/50 text-emerald-300 placeholder:text-slate-500 border-2 border-slate-700/50 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 rounded-lg"
        />
      </div>
    </div>
  );
}
