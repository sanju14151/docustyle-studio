import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { Components } from "react-markdown";

interface PreviewProps {
  content: string;
}

const Preview = ({ content }: PreviewProps) => {
  // Auto-format plain text to look like markdown
  const formatPlainText = (text: string): string => {
    // Check if content already has markdown formatting
    const hasMarkdown = /^#{1,6}\s|^\*\*|^\*|^-\s|^\d+\.\s|^```|^\||^>/.test(text.trim());
    
    if (hasMarkdown) {
      return text; // Already markdown, return as-is
    }
    
    // Split into lines and format
    const lines = text.split('\n');
    let formatted = '';
    let inCodeBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      
      // Skip empty lines
      if (!trimmed) {
        formatted += '\n';
        continue;
      }
      
      // Detect code-like patterns (indentation, special chars, etc.)
      const looksLikeCode = /^[\s]*[{}\[\]();]|^[\s]*[a-zA-Z_$][a-zA-Z0-9_$]*\s*[=:({]|^[\s]*(class|function|const|let|var|def|public|private|void|int|String)\s/.test(line);
      const hasIndent = /^[\s]{2,}/.test(line);
      
      if (looksLikeCode || hasIndent) {
        if (!inCodeBlock) {
          formatted += '```\n';
          inCodeBlock = true;
        }
        formatted += line + '\n';
      } else {
        if (inCodeBlock) {
          formatted += '```\n\n';
          inCodeBlock = false;
        }
        
        // Format as paragraph
        formatted += line + '\n\n';
      }
    }
    
    // Close code block if still open
    if (inCodeBlock) {
      formatted += '```\n';
    }
    
    return formatted;
  };
  
  // Custom components to add language labels to code blocks
  const components: Components = {
    code: ({ node, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "text";
      const isInline = !match;

      if (!isInline) {
        return (
          <div className="code-block-wrapper">
            <div className="code-block-header">{language}</div>
            <div className="code-block-content">
              <code className={className} {...props}>
                {children}
              </code>
            </div>
          </div>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    pre: ({ children }: any) => {
      return <pre>{children}</pre>;
    },
    p: ({ children }: any) => {
      return <p className="leading-relaxed">{children}</p>;
    },
  };

  return (
    <div className="h-full flex flex-col bg-[hsl(var(--preview-bg))]">
      <div className="p-4 border-b border-border bg-card">
        <h2 className="text-sm font-semibold text-foreground">Preview</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Live preview of your formatted document
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto markdown-preview">
          {content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={components}
            >
              {formatPlainText(content)}
            </ReactMarkdown>
          ) : (
            <div className="text-center text-muted-foreground py-20">
              <p className="text-lg">Your formatted content will appear here</p>
              <p className="text-sm mt-2">Start typing or paste any text to see it formatted</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
