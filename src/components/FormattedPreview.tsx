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
          'font-bold text-slate-900 dark:text-slate-100 tracking-tight',
          item.level === 1 && 'text-2xl mb-4 mt-6 pb-2 border-b border-slate-300',
          item.level === 2 && 'text-xl mb-3 mt-5',
          item.level === 3 && 'text-lg mb-3 mt-4',
          item.level === 4 && 'text-base mb-2 mt-3',
          item.level === 5 && 'text-sm mb-2 mt-3',
          item.level === 6 && 'text-sm mb-2 mt-2',
        ].filter(Boolean).join(' ');
        
        return (
          <HeadingTag key={index} className={headingClasses}>
            {item.content}
          </HeadingTag>
        );

      case 'code':
        return (
          <div key={index} className="my-4 rounded-md overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                {item.language || 'code'}
              </span>
            </div>
            <div className="overflow-x-auto">
              <pre className="m-0 p-4">
                <code className="text-sm font-mono text-slate-800 dark:text-slate-200 whitespace-pre leading-relaxed block">
                  {item.content}
                </code>
              </pre>
            </div>
          </div>
        );

      case 'table':
        return (
          <div key={index} className="my-4 overflow-x-auto rounded-md border border-slate-300 dark:border-slate-700">
            <table className="w-full">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  {item.rows?.[0]?.map((header, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide border-b border-slate-300 dark:border-slate-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900">
                {item.rows?.slice(1).map((row, rowIndex) => (
                  <tr 
                    key={rowIndex} 
                    className="border-b border-slate-200 dark:border-slate-700 last:border-b-0"
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300"
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
          <ul key={index} className="mb-4 space-y-1.5 list-disc list-inside">
            {item.items?.map((listItem, i) => (
              <li key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                {listItem}
              </li>
            ))}
          </ul>
        );

      case 'text':
        return (
          <p key={index} className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed text-sm">
            {item.content}
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950">
      <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-white dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Preview</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Formatted output ready for export
        </p>
      </div>
      <div id="preview-content" className="flex-1 p-8 overflow-y-auto bg-white dark:bg-slate-950">
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
