import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextInput({ value, onChange }: TextInputProps) {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950">
      <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-white dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Input</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Paste your plain text - automatic formatting applied
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
✓ Regular paragraphs"
          className="h-full min-h-[500px] resize-none font-mono text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 border border-slate-300 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:border-slate-400"
        />
      </div>
    </div>
  );
}
