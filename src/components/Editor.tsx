import { Textarea } from "@/components/ui/textarea";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Editor = ({ value, onChange }: EditorProps) => {
  return (
    <div className="h-full flex flex-col bg-[hsl(var(--editor-bg))]">
      <div className="p-4 border-b border-border bg-card">
        <h2 className="text-sm font-semibold text-foreground">Editor</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Write your content in Markdown or plain text
        </p>
      </div>
      <div className="flex-1 p-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Start writing your document here..."
          className="w-full h-full resize-none font-mono text-sm bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
    </div>
  );
};

export default Editor;
