import { useState, useRef } from "react";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import ExportButtons from "@/components/ExportButtons";
import { FileText } from "lucide-react";

const defaultContent = `# Welcome to DocuStyle

Transform your markdown and plain text into **beautifully formatted documents**.

## Features

- **Bold, Bright Headings** - Your headings stand out with vibrant colors
- **Professional Tables** - Clean, structured data presentation
- **Syntax Highlighted Code** - Beautiful code blocks with proper formatting
- **Multiple Export Formats** - PDF, Word, and more

## Example Table

| Feature | Status | Priority |
|---------|--------|----------|
| PDF Export | ✅ Active | High |
| Word Export | ✅ Active | High |
| Markdown Support | ✅ Active | Critical |
| Code Highlighting | ✅ Active | Medium |

## Code Example

\`\`\`javascript
function formatDocument(content) {
  return {
    styled: true,
    beautiful: true,
    professional: content
  };
}
\`\`\`

## Getting Started

1. Edit the content in the **left panel**
2. See your changes **live** in the right panel
3. Export to your preferred format when ready

> Start creating beautiful documents today!

---

*Built with ❤️ for content creators*
`;

const Index = () => {
  const [content, setContent] = useState(defaultContent);
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">DocuStyle</h1>
              <p className="text-xs text-muted-foreground">
                Professional Document Formatter
              </p>
            </div>
          </div>
          <ExportButtons content={content} previewRef={previewRef} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        <div className="border-r border-border overflow-hidden">
          <Editor value={content} onChange={setContent} />
        </div>
        <div ref={previewRef} className="overflow-hidden">
          <Preview content={content} />
        </div>
      </div>
    </div>
  );
};

export default Index;
