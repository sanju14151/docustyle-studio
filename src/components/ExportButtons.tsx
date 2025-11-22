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
    if (!previewRef.current || !content) {
      toast.error("Please add some content before exporting");
      return;
    }

    const element = previewRef.current.querySelector(".markdown-preview") as HTMLElement;
    
    // Create a temporary container with all styles embedded
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = element.innerHTML;
    tempContainer.className = "markdown-preview";
    
    // Add logo to the top of the PDF
    const logo = document.createElement("div");
    logo.style.cssText = "text-align: center; margin-bottom: 20px; padding: 20px 0; border-bottom: 2px solid #e2e8f0;";
    const logoImg = document.createElement("img");
    logoImg.src = "/logo.png";
    logoImg.style.cssText = "height: 60px; width: auto;";
    logoImg.alt = "TOMO MEOW";
    logo.appendChild(logoImg);
    tempContainer.insertBefore(logo, tempContainer.firstChild);
    
    // Embed all CSS styles directly into the container
    const style = document.createElement("style");
    style.textContent = `
      * {
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: #2d3748;
        line-height: 1.6;
      }
      
      /* Code block styling */
      .code-block-wrapper {
        background: #f7fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        overflow: hidden;
        margin: 24px 0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      .code-block-header {
        background: #e2e8f0;
        padding: 8px 16px;
        font-size: 11px;
        font-weight: 600;
        color: #4a5568;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px solid #cbd5e0;
      }
      
      .code-block-content {
        padding: 16px;
        overflow-x: auto;
      }
      
      pre {
        margin: 0;
        background: transparent !important;
        border: none !important;
      }
      
      code {
        font-family: 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.6;
      }
      
      pre code {
        background: transparent !important;
        padding: 0 !important;
      }
      
      :not(pre) > code {
        background: #f7fafc;
        color: #0891b2;
        padding: 2px 8px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
      }
      
      /* Table styling */
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 24px 0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      thead {
        background: linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%);
      }
      
      th {
        border: 1px solid #e2e8f0;
        padding: 14px 20px;
        text-align: left;
        font-weight: 700;
        color: #2d3748;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      td {
        border: 1px solid #e2e8f0;
        padding: 14px 20px;
        color: #4a5568;
      }
      
      tbody tr:nth-child(even) {
        background: #f7fafc;
      }
      
      /* Heading styling */
      h1 {
        font-size: 32px;
        font-weight: 700;
        color: #0891b2;
        margin-bottom: 24px;
        margin-top: 32px;
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      
      h2 {
        font-size: 28px;
        font-weight: 700;
        color: #3b82f6;
        margin-bottom: 20px;
        margin-top: 28px;
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      
      h3 {
        font-size: 22px;
        font-weight: 600;
        color: #0891b2;
        margin-bottom: 16px;
        margin-top: 24px;
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      
      h4, h5, h6 {
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 12px;
        margin-top: 20px;
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
      
      p {
        margin-bottom: 16px;
        color: #4a5568;
      }
      
      ul, ol {
        margin-bottom: 16px;
        margin-left: 24px;
        color: #4a5568;
      }
      
      li {
        margin-bottom: 8px;
      }
      
      a {
        color: #0891b2;
        text-decoration: underline;
      }
      
      blockquote {
        border-left: 4px solid #0891b2;
        padding-left: 16px;
        font-style: italic;
        margin: 16px 0;
        color: #718096;
      }
      
      hr {
        border: none;
        border-top: 1px solid #e2e8f0;
        margin: 32px 0;
      }
      
      strong {
        font-weight: 700;
      }
      
      em {
        font-style: italic;
      }
    `;
    tempContainer.appendChild(style);
    document.body.appendChild(tempContainer);

    const opt = {
      margin: [0.75, 0.75, 0.75, 0.75] as [number, number, number, number],
      filename: "document.pdf",
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { 
        scale: 2.5, 
        useCORS: true,
        logging: false,
        letterRendering: true,
        allowTaint: true
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
        avoid: ['pre', 'table', 'h1', 'h2', 'h3', '.code-block-wrapper']
      }
    };

    toast.promise(
      html2pdf().set(opt).from(tempContainer).save().then(() => {
        document.body.removeChild(tempContainer);
      }),
      {
        loading: "Generating PDF with exact styling...",
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
      saveAs(blob, "document.docx");
      toast.success("Word document downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate Word document");
      console.error(error);
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={exportToPDF}
        variant="default"
        size="sm"
        className="gap-2"
        disabled={!content}
      >
        <Download className="h-4 w-4" />
        Export PDF
      </Button>
      <Button
        onClick={exportToDOCX}
        variant="secondary"
        size="sm"
        className="gap-2"
        disabled={!content}
      >
        <FileText className="h-4 w-4" />
        Export DOCX
      </Button>
    </div>
  );
};

export default ExportButtons;
