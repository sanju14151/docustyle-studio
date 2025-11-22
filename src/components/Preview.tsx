import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { Components } from "react-markdown";

interface PreviewProps {
  content: string;
}

const Preview = ({ content }: PreviewProps) => {
  // Auto-format plain text to look stylish like markdown
  const formatPlainText = (text: string): string => {
    // Check if content already has markdown formatting
    const hasMarkdown = /^#{1,6}\s|^\*\*|^\*|^-\s|^\d+\.\s|^```|^\||^>/.test(text.trim());
    
    if (hasMarkdown) {
      return text; // Already markdown, return as-is
    }
    
    // Split into paragraphs (double line breaks)
    const paragraphs = text.split(/\n\s*\n/);
    let formatted = '';
    let inCodeBlock = false;
    let codeLanguage = '';
    
    for (let para of paragraphs) {
      const lines = para.split('\n');
      let paraFormatted = '';
      let isCode = false;
      
      // Check if entire paragraph is code
      const codePatterns = [
        /^[\s]*(class|interface|function|const|let|var|def|public|private|protected|void|int|String|float|double|boolean)\s/,
        /^[\s]*[{}\[\]();]/,
        /^[\s]*import\s|^[\s]*from\s|^[\s]*package\s/,
        /^[\s]*[a-zA-Z_$][a-zA-Z0-9_$]*\s*[=:({]/,
        /^[\s]*(if|else|for|while|switch|return|break|continue)\s*[\s(]/,
        /^[\s]*\/\/|^[\s]*\/\*|^[\s]*\*/,
        /^[\s]*#include|^[\s]*#define/,
      ];
      
      isCode = lines.some(line => 
        codePatterns.some(pattern => pattern.test(line)) ||
        /^[\s]{2,}/.test(line)
      );
      
      // Detect language
      if (isCode) {
        if (/\b(class|public|private|void|int|String)\b/.test(para)) {
          codeLanguage = 'java';
        } else if (/\b(def|import.*from|self)\b/.test(para)) {
          codeLanguage = 'python';
        } else if (/\b(const|let|var|function|=>)\b/.test(para)) {
          codeLanguage = 'javascript';
        } else if (/\b(interface|type|namespace)\b/.test(para)) {
          codeLanguage = 'typescript';
        } else if (/#include|printf|void main/.test(para)) {
          codeLanguage = 'c';
        } else {
          codeLanguage = 'text';
        }
      }
      
      if (isCode) {
        if (!inCodeBlock) {
          formatted += '```' + codeLanguage + '\n';
          inCodeBlock = true;
        }
        formatted += para + '\n';
      } else {
        if (inCodeBlock) {
          formatted += '```\n\n';
          inCodeBlock = false;
        }
        
        // Format text paragraphs
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          if (!line) continue;
          
          // Check if line looks like a title/heading (short, no punctuation at end, or ends with :)
          if (line.length < 60 && (!/[.!?]$/.test(line) || /[:]\s*$/.test(line))) {
            // Make it a heading
            if (line.length < 30 && i === 0) {
              paraFormatted += `## ${line}\n\n`;
            } else {
              paraFormatted += `### ${line}\n\n`;
            }
          } else if (/^\d+[\.)]\s/.test(line)) {
            // Numbered list
            paraFormatted += line + '\n';
          } else if (/^[-*•]\s/.test(line)) {
            // Bullet list
            paraFormatted += line.replace(/^[-*•]\s/, '- ') + '\n';
          } else {
            // Regular paragraph
            paraFormatted += line + '\n\n';
          }
        }
        
        formatted += paraFormatted;
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
