import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

interface PreviewProps {
  content: string;
}

const Preview = ({ content }: PreviewProps) => {
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
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {content}
            </ReactMarkdown>
          ) : (
            <div className="text-center text-muted-foreground py-20">
              <p className="text-lg">Your formatted content will appear here</p>
              <p className="text-sm mt-2">Start typing in the editor to see the preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Preview;
