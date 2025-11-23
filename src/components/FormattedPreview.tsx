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
          'font-bold tracking-tight',
          item.level === 1 && 'text-3xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-6 mt-8 pb-3 border-b-2 border-cyan-500/30',
          item.level === 2 && 'text-2xl text-amber-600 dark:text-amber-400 mb-5 mt-7 flex items-center gap-2 before:content-["⭐"] before:text-xl',
          item.level === 3 && 'text-xl text-purple-700 dark:text-purple-400 mb-4 mt-6 font-semibold',
          item.level === 4 && 'text-lg text-emerald-700 dark:text-emerald-400 mb-3 mt-5',
          item.level === 5 && 'text-base text-blue-700 dark:text-blue-400 mb-3 mt-4',
          item.level === 6 && 'text-sm text-slate-700 dark:text-slate-300 mb-2 mt-3',
        ].filter(Boolean).join(' ');
        
        return (
          <HeadingTag key={index} className={headingClasses}>
            {item.content}
          </HeadingTag>
        );

      case 'code':
        return (
          <div key={index} className="my-6 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="px-4 py-2.5 bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-900 dark:to-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider ml-2">
                  {item.language || 'code'}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <pre className="m-0 p-5">
                <code className="text-sm font-mono text-emerald-300 whitespace-pre leading-loose block">
                  {item.content}
                </code>
              </pre>
            </div>
          </div>
        );

      case 'table':
        return (
          <div key={index} className="my-6 overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600">
                  <tr>
                    {item.rows?.[0]?.map((header, i) => (
                      <th
                        key={i}
                        className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider"
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
                      className={`
                        border-b border-slate-200 dark:border-slate-700
                        hover:bg-cyan-50 dark:hover:bg-slate-800 
                        transition-all duration-200
                        ${rowIndex % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900' : 'bg-white dark:bg-slate-950'}
                      `}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 font-medium"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'list':
        return (
          <ul key={index} className="mb-5 space-y-2.5 pl-1">
            {item.items?.map((listItem, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 leading-relaxed group">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold mt-0.5 group-hover:scale-110 transition-transform">
                  {i + 1}
                </span>
                <span className="flex-1">{listItem}</span>
              </li>
            ))}
          </ul>
        );

      case 'text':
        return (
          <p key={index} className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed text-base">
            {item.content}
          </p>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="border-b-2 border-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Preview</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          ✨ Formatted output with premium styling
        </p>
      </div>
      <div id="preview-content" className="flex-1 p-8 overflow-y-auto">
        {parsedContent.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-slate-500 dark:text-slate-400 text-center text-lg font-medium">
              Your formatted content will appear here...
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-center text-sm mt-2">
              Paste your plain text to see the magic ✨
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
