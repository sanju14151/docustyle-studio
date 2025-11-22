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
    const opt = {
      margin: 1,
      filename: "document.pdf",
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" as const },
    };

    toast.promise(
      html2pdf().set(opt).from(element).save(),
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
