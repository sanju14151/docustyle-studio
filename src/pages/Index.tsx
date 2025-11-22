import { useState, useRef } from "react";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import ExportButtons from "@/components/ExportButtons";
import { FileText } from "lucide-react";

const defaultContent = `# Welcome to TOMO MEOW

Transform your markdown and plain text into **beautifully formatted documents**.

## Features

- **Bold, Bright Headings** - Your headings stand out with vibrant colors
- **Professional Tables** - Clean, structured data presentation
- **Syntax Highlighted Code** - Beautiful code blocks with language labels
- **Multiple Export Formats** - PDF, Word, and more with perfect formatting
- **Page Break Prevention** - Code blocks and tables stay together

## Example Table

| Feature | Status | Priority |
|---------|--------|----------|
| PDF Export | ✅ Active | High |
| Word Export | ✅ Active | High |
| Markdown Support | ✅ Active | Critical |
| Code Highlighting | ✅ Active | Medium |
| Language Labels | ✅ Active | High |

## Code Example with Language

\`\`\`javascript
function formatDocument(content) {
  return {
    styled: true,
    beautiful: true,
    professional: content,
    pageBreakSafe: true
  };
}
\`\`\`

\`\`\`python
def process_document(text):
    """Process and format document content"""
    return {
        'formatted': True,
        'stylish': True,
        'content': text
    }
\`\`\`

\`\`\`typescript
interface DocumentConfig {
  title: string;
  format: 'pdf' | 'docx';
  styling: {
    theme: string;
    colors: string[];
  };
}

const config: DocumentConfig = {
  title: "My Document",
  format: "pdf",
  styling: {
    theme: "modern",
    colors: ["cyan", "blue"]
  }
};
\`\`\`

## Getting Started

1. Edit the content in the **left panel**
2. See your changes **live** in the right panel
3. Use language tags in code blocks like \`\`\`javascript
4. Export to your preferred format when ready

> Start creating beautiful documents today!

---

*Built with ❤️ by TOMO MEOW*
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
            <img src="/logo.png" alt="TOMO MEOW Logo" className="h-12 w-12 rounded-lg" />
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-wide">TOMO MEOW</h1>
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
