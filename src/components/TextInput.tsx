import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextInput({ value, onChange }: TextInputProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">Input</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Paste your plain text - automatic formatting applied!
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
          className="h-full min-h-[500px] resize-none font-mono text-sm border-border focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}
