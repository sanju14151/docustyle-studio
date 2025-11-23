import { ParsedContent } from '@/lib/textParser';

interface FormattedPreviewProps {
  parsedContent: ParsedContent[];
}

export function FormattedPreview({ parsedContent }: FormattedPreviewProps) {
  const renderContent = (item: ParsedContent, index: number) => {
    switch (item.type) {
      case 'heading':
        const HeadingTag = `h${item.level || 1}` as keyof JSX.IntrinsicElements;
        const headingClasses = [
          'font-bold mb-4 mt-6 tracking-tight',
          item.level === 1 && 'text-3xl text-slate-900 dark:text-slate-100',
          item.level === 2 && 'text-2xl text-slate-800 dark:text-slate-200',
          item.level === 3 && 'text-xl text-slate-800 dark:text-slate-200',
          item.level === 4 && 'text-lg text-slate-700 dark:text-slate-300',
          item.level === 5 && 'text-base text-slate-700 dark:text-slate-300',
          item.level === 6 && 'text-sm text-slate-700 dark:text-slate-300',
        ].filter(Boolean).join(' ');
        
        return (
          <HeadingTag key={index} className={headingClasses}>
            {item.content}
          </HeadingTag>
        );

      case 'code':
        return (
          <div key={index} className="my-4 rounded-lg overflow-hidden border border-border bg-slate-50 dark:bg-slate-900">
            <div className="px-4 py-2 bg-white dark:bg-slate-800 border-b border-border flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                {item.language || 'code'}
              </span>
            </div>
            <div className="overflow-x-auto bg-slate-50 dark:bg-slate-900">
              <pre className="m-0 p-4">
                <code className="text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-pre leading-relaxed">
                  {item.content}
                </code>
              </pre>
            </div>
          </div>
        );

      case 'table':
        return (
          <div key={index} className="my-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                <tr>
                  {item.rows?.[0]?.map((header, i) => (
                    <th
                      key={i}
                      className="px-6 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                {item.rows?.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'list':
        return (
          <ul key={index} className="list-disc list-inside mb-4 space-y-2 text-slate-700 dark:text-slate-300">
            {item.items?.map((listItem, i) => (
              <li key={i} className="leading-relaxed pl-2">
                {listItem}
              </li>
            ))}
          </ul>
        );

      case 'text':
        return (
          <p key={index} className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
            {item.content}
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950">
      <div className="border-b border-border px-6 py-4 bg-white dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Preview</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Formatted output with premium styling
        </p>
      </div>
      <div id="preview-content" className="flex-1 p-6 overflow-y-auto bg-white dark:bg-slate-950">
        {parsedContent.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500 dark:text-slate-400 text-center">
              Your formatted content will appear here...
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {parsedContent.map((item, index) => renderContent(item, index))}
          </div>
        )}
      </div>
    </div>
  );
}
