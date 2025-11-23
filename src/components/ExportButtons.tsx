import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import html2pdf from "html2pdf.js";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from "docx";
import { saveAs } from "file-saver";
import { toast } from "sonner";
import { ParsedContent } from "@/lib/textParser";

interface ExportButtonsProps {
  content: string;
  previewRef: React.RefObject<HTMLDivElement>;
  mode?: 'markdown' | 'plain';
  plainTextContent?: ParsedContent[];
}

const ExportButtons = ({ content, previewRef, mode = 'markdown', plainTextContent }: ExportButtonsProps) => {
  const exportToPDF = () => {
    if (mode === 'markdown' && !content) {
      toast.error("Please add some content before exporting");
      return;
    }
    
    if (mode === 'plain' && (!plainTextContent || plainTextContent.length === 0)) {
      toast.error("Please add some content before exporting");
      return;
    }

    if (!previewRef.current) {
      toast.error("Preview not ready. Please try again.");
      return;
    }

    // Handle different preview modes
    const selector = mode === 'plain' ? "#preview-content" : ".markdown-preview";
    const element = previewRef.current.querySelector(selector) as HTMLElement;
    
    if (!element || !element.innerHTML) {
      toast.error("Preview content not found. Please try again.");
      return;
    }
    
    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Create a temporary container with all styles embedded
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = clonedElement.innerHTML;
    tempContainer.className = "markdown-preview";
    tempContainer.style.cssText = "width: 100%; max-width: 800px; margin: 0 auto;";
    
    // Add logo and brand name to the top of the PDF (perplexity-style header)
    const header = document.createElement("div");
    header.style.cssText = "text-align: center; margin-bottom: 30px; padding: 30px 0 20px 0; page-break-after: avoid !important;";
    
    const logoContainer = document.createElement("div");
    logoContainer.style.cssText = "display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 10px;";
    
    const logoImg = document.createElement("img");
    logoImg.src = window.location.origin + "/logo.png";
    logoImg.style.cssText = "height: 45px; width: auto;";
    logoImg.alt = "TOMO MEOW";
    logoImg.crossOrigin = "anonymous";
    
    const brandText = document.createElement("span");
    brandText.textContent = "TOMO MEOW";
    brandText.style.cssText = "font-size: 26px; font-weight: 600; color: #1a202c; letter-spacing: -0.5px;";
    
    logoContainer.appendChild(logoImg);
    logoContainer.appendChild(brandText);
    header.appendChild(logoContainer);
    tempContainer.insertBefore(header, tempContainer.firstChild);
    
    // Embed all CSS styles directly into the container
    const style = document.createElement("style");
    style.textContent = `
      * {
        box-sizing: border-box;
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
        color: #0f172a;
        line-height: 1.6;
        background: #ffffff;
      }
      
      /* Heading styles - matching preview exactly */
      h1 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 1rem;
        margin-top: 1.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #cbd5e1;
        letter-spacing: -0.025em;
        page-break-after: avoid !important;
      }
      
      h2 {
        font-size: 1.25rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 0.75rem;
        margin-top: 1.25rem;
        letter-spacing: -0.025em;
        page-break-after: avoid !important;
      }
      
      h3 {
        font-size: 1.125rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 0.75rem;
        margin-top: 1rem;
        letter-spacing: -0.025em;
        page-break-after: avoid !important;
      }
      
      h4, h5, h6 {
        font-size: 1rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 0.5rem;
        margin-top: 0.75rem;
        letter-spacing: -0.025em;
        page-break-after: avoid !important;
      }
      
      /* Paragraph styles */
      p {
        font-size: 0.875rem;
        color: #334155;
        margin-bottom: 0.75rem;
        line-height: 1.6;
      }
      
      /* List styles */
      ul {
        margin-bottom: 1rem;
        padding-left: 1.5rem;
        list-style-type: disc;
      }
      
      li {
        font-size: 0.875rem;
        color: #334155;
        line-height: 1.6;
        margin-bottom: 0.375rem;
      }
      
      /* Code block styling */
      div[class*="rounded"] > div:first-child {
        background: #f1f5f9;
        padding: 0.5rem 1rem;
        border-bottom: 1px solid #cbd5e1;
      }
      
      div[class*="rounded"] > div:first-child span {
        font-size: 0.75rem;
        font-weight: 600;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      pre {
        margin: 0;
        padding: 1rem;
        background: #f8fafc !important;
        border-radius: 0.375rem;
        overflow-x: auto;
      }
      
      code {
        font-family: 'Courier New', 'Consolas', 'Monaco', monospace;
        font-size: 0.875rem;
        line-height: 1.6;
        color: #1e293b;
      }
      
      pre code {
        background: transparent !important;
        padding: 0 !important;
        display: block;
      }
      
      /* Code container */
      .my-4 {
        margin-top: 1rem;
        margin-bottom: 1rem;
        border: 1px solid #cbd5e1;
        border-radius: 0.375rem;
        overflow: hidden;
        background: #f8fafc;
        page-break-inside: avoid !important;
      }
      
      /* Table styling */
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
        border: 1px solid #cbd5e1;
        border-radius: 0.375rem;
        overflow: hidden;
        page-break-inside: avoid !important;
      }
      
      thead {
        background: #f1f5f9;
      }
      
      th {
        padding: 0.75rem 1rem;
        text-align: left;
        font-weight: 700;
        color: #475569;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px solid #cbd5e1;
      }
      
      td {
        padding: 0.75rem 1rem;
        color: #334155;
        font-size: 0.875rem;
        border-bottom: 1px solid #e2e8f0;
      }
      
      tbody tr:last-child td {
        border-bottom: none;
      }
      
      /* Additional utility styles */
      a {
        color: #0d6efd;
        text-decoration: none;
      }
      
      blockquote {
        border-left: 3px solid #cbd5e1;
        padding-left: 16px;
        font-style: italic;
        margin: 16px 0;
        color: #64748b;
      }
      
      hr {
        border: none;
        border-top: 1px solid #cbd5e1;
        margin: 24px 0;
      }
      
      strong {
        font-weight: 700;
        color: #0f172a;
      }
      
      em {
        font-style: italic;
      }
      
      /* Remove background gradients for print */
      .max-w-4xl {
        max-width: 56rem;
        margin: 0 auto;
      }
    `;
    tempContainer.appendChild(style);
    document.body.appendChild(tempContainer);

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
      filename: "meow.pdf",
      image: { type: "jpeg" as const, quality: 0.95 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: true,
        windowWidth: 800,
        windowHeight: document.body.scrollHeight
      },
      jsPDF: { 
        unit: "in", 
        format: "letter", 
        orientation: "portrait" as const,
        compress: true
      },
      pagebreak: { 
        mode: ['avoid-all', 'css', 'legacy'] as any,
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: ['pre', 'table', 'h1', 'h2', 'h3', 'h4', '.code-block-wrapper', 'tr', 'li']
      }
    };

    // Prevent page zoom during PDF generation
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';

    toast.promise(
      html2pdf().set(opt).from(tempContainer).save().then(() => {
        document.body.removeChild(tempContainer);
        // Restore original styles
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = '';
      }).catch((error) => {
        document.body.removeChild(tempContainer);
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = '';
        throw error;
      }),
      {
        loading: "Generating PDF...",
        success: "PDF downloaded successfully!",
        error: "Failed to generate PDF",
      }
    );
  };

  const parsePlainTextToDocx = (parsedContent: ParsedContent[]) => {
    const children: (Paragraph | Table)[] = [];

    parsedContent.forEach((item) => {
      switch (item.type) {
        case 'heading':
          const headingLevel = 
            item.level === 1 ? HeadingLevel.HEADING_1 :
            item.level === 2 ? HeadingLevel.HEADING_2 :
            item.level === 3 ? HeadingLevel.HEADING_3 :
            item.level === 4 ? HeadingLevel.HEADING_4 :
            item.level === 5 ? HeadingLevel.HEADING_5 :
            HeadingLevel.HEADING_6;
          
          children.push(
            new Paragraph({
              text: item.content,
              heading: headingLevel,
              spacing: { before: 240, after: 120 },
            })
          );
          break;

        case 'code':
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `[${item.language?.toUpperCase()}]`,
                  bold: true,
                }),
              ],
              spacing: { before: 120, after: 60 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: item.content,
                  font: "Courier New",
                }),
              ],
              spacing: { after: 120 },
            })
          );
          break;

        case 'table':
          if (item.rows && item.rows.length > 0) {
            const rows = item.rows.map(
              (rowData) =>
                new TableRow({
                  children: rowData.map(
                    (cellData) =>
                      new TableCell({
                        children: [new Paragraph({ text: cellData })],
                        width: { size: 100 / rowData.length, type: WidthType.PERCENTAGE },
                      })
                  ),
                })
            );

            children.push(
              new Table({
                rows,
                width: { size: 100, type: WidthType.PERCENTAGE },
              })
            );
          }
          break;

        case 'list':
          if (item.items) {
            item.items.forEach((listItem) => {
              children.push(
                new Paragraph({
                  text: `• ${listItem}`,
                  spacing: { after: 60 },
                })
              );
            });
          }
          break;

        case 'text':
          children.push(
            new Paragraph({
              text: item.content,
              spacing: { after: 120 },
            })
          );
          break;
      }
    });

    return children;
  };

  const parseMarkdownToDocx = (markdown: string) => {
    const lines = markdown.split("\n");
    const children: (Paragraph | Table)[] = [];

    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();

      // Headers
      if (line.startsWith("# ")) {
        children.push(
          new Paragraph({
            text: line.replace(/^#\s+/, ""),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          })
        );
      } else if (line.startsWith("## ")) {
        children.push(
          new Paragraph({
            text: line.replace(/^##\s+/, ""),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
      } else if (line.startsWith("### ")) {
        children.push(
          new Paragraph({
            text: line.replace(/^###\s+/, ""),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 160, after: 80 },
          })
        );
      }
      // Tables
      else if (line.startsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith("|")) {
          tableLines.push(lines[i].trim());
          i++;
        }
        i--;

        const tableData = tableLines
          .filter((l) => !l.includes("---"))
          .map((l) =>
            l
              .split("|")
              .slice(1, -1)
              .map((cell) => cell.trim())
          );

        if (tableData.length > 0) {
          const rows = tableData.map(
            (rowData, idx) =>
              new TableRow({
                children: rowData.map(
                  (cellData) =>
                    new TableCell({
                      children: [new Paragraph({ text: cellData })],
                      width: { size: 100 / rowData.length, type: WidthType.PERCENTAGE },
                    })
                ),
              })
          );

          children.push(
            new Table({
              rows,
              width: { size: 100, type: WidthType.PERCENTAGE },
            })
          );
        }
      }
      // Code blocks
      else if (line.startsWith("```")) {
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: codeLines.join("\n"),
                font: "Courier New",
              }),
            ],
            spacing: { before: 120, after: 120 },
          })
        );
      }
      // Regular paragraphs
      else if (line) {
        const runs: TextRun[] = [];
        const parts = line.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

        parts.forEach((part) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            runs.push(new TextRun({ text: part.slice(2, -2), bold: true }));
          } else if (part.startsWith("*") && part.endsWith("*")) {
            runs.push(new TextRun({ text: part.slice(1, -1), italics: true }));
          } else if (part.startsWith("`") && part.endsWith("`")) {
            runs.push(
              new TextRun({
                text: part.slice(1, -1),
                font: "Courier New",
              })
            );
          } else if (part) {
            runs.push(new TextRun(part));
          }
        });

        children.push(
          new Paragraph({
            children: runs,
            spacing: { after: 120 },
          })
        );
      }

      i++;
    }

    return children;
  };

  const exportToDOCX = async () => {
    if (mode === 'markdown' && !content) {
      toast.error("Please add some content before exporting");
      return;
    }
    
    if (mode === 'plain' && (!plainTextContent || plainTextContent.length === 0)) {
      toast.error("Please add some content before exporting");
      return;
    }

    try {
      const sections = mode === 'markdown' 
        ? parseMarkdownToDocx(content)
        : parsePlainTextToDocx(plainTextContent!);

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: sections,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, "meow.docx");
      toast.success("Word document downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate Word document");
      console.error(error);
    }
  };

  const hasContent = mode === 'markdown' 
    ? !!content 
    : !!(plainTextContent && plainTextContent.length > 0);

  return (
    <div className="flex gap-2 w-full">
      <Button
        onClick={exportToPDF}
        variant="default"
        size="sm"
        className="gap-2 flex-1 sm:flex-none"
        disabled={!hasContent}
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Export PDF</span>
        <span className="sm:hidden">PDF</span>
      </Button>
      <Button
        onClick={exportToDOCX}
        variant="secondary"
        size="sm"
        className="gap-2 flex-1 sm:flex-none"
        disabled={!hasContent}
      >
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Export DOCX</span>
        <span className="sm:hidden">DOCX</span>
      </Button>
    </div>
  );
};

export default ExportButtons;
