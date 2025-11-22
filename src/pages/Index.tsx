import { useState, useRef } from "react";
import Editor from "@/components/Editor";
import Preview from "@/components/Preview";
import ExportButtons from "@/components/ExportButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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

*Built with ❤️ by AJ STUDIOZ*
`;

const Index = () => {
  const [content, setContent] = useState(defaultContent);
  const previewRef = useRef<HTMLDivElement>(null);
  const mobilePreviewRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center justify-center w-full">
            <img src="/sidebar-logo.png" alt="Logo" className="h-20 w-20 object-contain" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 p-4 space-y-2">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <h3 className="font-semibold text-sm text-foreground mb-2">Quick Start</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Write in markdown</li>
              <li>• Preview in real-time</li>
              <li>• Export to PDF/DOCX</li>
            </ul>
          </div>
          
          <div className="p-3 rounded-lg bg-muted">
            <h3 className="font-semibold text-sm text-foreground mb-2">Features</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>✨ Syntax highlighting</li>
              <li>📊 Beautiful tables</li>
              <li>🎨 Professional styling</li>
              <li>📱 Mobile responsive</li>
            </ul>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Built with ❤️ by AJ STUDIOZ
          </p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-8 w-8"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <img src="/logo.png" alt="TOMO MEOW Logo" className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg" />
              <div>
                <h1 className="text-sm sm:text-xl font-bold text-foreground tracking-wide">TOMO MEOW</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Professional Document Formatter
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <ExportButtons content={content} previewRef={previewRef} />
            </div>
          </div>
        </header>

        {/* Desktop: Side by side layout */}
        <div className="hidden lg:flex flex-1 overflow-hidden">
          <div className="flex-1 border-r border-border overflow-hidden">
            <Editor value={content} onChange={setContent} />
          </div>
          <div ref={previewRef} className="flex-1 overflow-hidden">
            <Preview content={content} />
          </div>
        </div>

        {/* Mobile/Tablet: Tabbed layout */}
        <div className="lg:hidden flex-1 flex flex-col overflow-hidden">
          <Tabs defaultValue="editor" className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-shrink-0">
              <TabsList className="w-full rounded-none border-b">
                <TabsTrigger value="editor" className="flex-1">Editor</TabsTrigger>
                <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="editor" className="flex-1 overflow-auto m-0 data-[state=active]:flex data-[state=active]:flex-col">
              <Editor value={content} onChange={setContent} />
            </TabsContent>
            <TabsContent value="preview" className="flex-1 overflow-auto m-0 data-[state=active]:flex data-[state=active]:flex-col" ref={mobilePreviewRef}>
              <Preview content={content} />
            </TabsContent>
          </Tabs>
          <div className="flex-shrink-0 border-t border-border p-3 bg-card">
            <ExportButtons 
              content={content} 
              previewRef={typeof window !== 'undefined' && window.innerWidth >= 1024 ? previewRef : mobilePreviewRef} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
