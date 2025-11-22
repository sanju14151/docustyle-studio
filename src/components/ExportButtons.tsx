import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import html2pdf from "html2pdf.js";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from "docx";
import { saveAs } from "file-saver";
import { toast } from "sonner";

interface ExportButtonsProps {
  content: string;
  previewRef: React.RefObject<HTMLDivElement>;
}

const ExportButtons = ({ content, previewRef }: ExportButtonsProps) => {
  const exportToPDF = () => {
    if (!content) {
      toast.error("Please add some content before exporting");
      return;
    }

    if (!previewRef.current) {
      toast.error("Preview not ready. Please try again.");
      return;
    }

    const element = previewRef.current.querySelector(".markdown-preview") as HTMLElement;
    
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
        color: #212529;
        line-height: 1.6;
        background: #ffffff;
      }
      
      /* Code block styling - Perplexity style */
      .code-block-wrapper {
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        border-radius: 6px;
        overflow: hidden;
        margin: 18px 0;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-before: auto !important;
        page-break-after: auto !important;
      }
      
      .code-block-header {
        background: #ffffff;
        padding: 8px 14px;
        font-size: 11px;
        font-weight: 600;
        color: #495057;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 1px solid #e9ecef;
        font-family: 'Courier New', monospace;
      }
      
      .code-block-content {
        padding: 14px 16px;
        overflow-x: auto;
        background: #f8f9fa;
      }
      
      pre {
        margin: 0;
        background: transparent !important;
        border: none !important;
      }
      
      code {
        font-family: 'Courier New', 'Consolas', monospace;
        font-size: 13px;
        line-height: 1.6;
        color: #212529;
      }
      
      pre code {
        background: transparent !important;
        padding: 0 !important;
      }
      
      :not(pre) > code {
        background: #e9ecef;
        color: #d63384;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 500;
      }
      
      /* Table styling */
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        overflow: hidden;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      thead {
        background: linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%);
      }
      
      th {
        border: 1px solid #e2e8f0;
        padding: 10px 14px;
        text-align: left;
        font-weight: 700;
        color: #2d3748;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      td {
        border: 1px solid #e2e8f0;
        padding: 10px 14px;
        color: #4a5568;
        font-size: 13px;
      }
      
      tbody tr:nth-child(even) {
        background: #f7fafc;
      }
      
      /* Heading styling - Perplexity style */
      h1 {
        font-size: 26px;
        font-weight: 700;
        color: #212529;
        margin-bottom: 14px;
        margin-top: 0;
        padding-top: 8px;
        page-break-after: avoid !important;
        break-after: avoid !important;
        page-break-inside: avoid !important;
      }
      
      h2 {
        font-size: 20px;
        font-weight: 700;
        color: #212529;
        margin-bottom: 12px;
        margin-top: 24px;
        page-break-after: avoid !important;
        break-after: avoid !important;
        page-break-inside: avoid !important;
      }
      
      h3 {
        font-size: 18px;
        font-weight: 600;
        color: #212529;
        margin-bottom: 10px;
        margin-top: 20px;
        page-break-after: avoid !important;
        break-after: avoid !important;
        page-break-inside: avoid !important;
      }
      
      h4, h5, h6 {
        font-weight: 600;
        color: #495057;
        margin-bottom: 10px;
        margin-top: 16px;
        page-break-after: avoid !important;
        break-after: avoid !important;
        page-break-inside: avoid !important;
      }
      
      p {
        margin-bottom: 14px;
        color: #495057;
        line-height: 1.6;
        font-size: 14px;
      }
      
      ul, ol {
        margin-bottom: 14px;
        margin-left: 24px;
        color: #495057;
      }
      
      li {
        margin-bottom: 6px;
        line-height: 1.6;
        font-size: 14px;
      }
      
      a {
        color: #0d6efd;
        text-decoration: none;
      }
      
      a:hover {
        text-decoration: underline;
      }
      
      blockquote {
        border-left: 3px solid #dee2e6;
        padding-left: 16px;
        font-style: italic;
        margin: 16px 0;
        color: #6c757d;
      }
      
      hr {
        border: none;
        border-top: 1px solid #dee2e6;
        margin: 24px 0;
      }
      
      strong {
        font-weight: 700;
        color: #212529;
      }
      
      em {
        font-style: italic;
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
    if (!content) {
      toast.error("Please add some content before exporting");
      return;
    }

    try {
      const sections = parseMarkdownToDocx(content);

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

  return (
    <div className="flex gap-2 w-full">
      <Button
        onClick={exportToPDF}
        variant="default"
        size="sm"
        className="gap-2 flex-1 sm:flex-none"
        disabled={!content}
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
        disabled={!content}
      >
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Export DOCX</span>
        <span className="sm:hidden">DOCX</span>
      </Button>
    </div>
  );
};

export default ExportButtons;
