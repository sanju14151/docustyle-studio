export interface ParsedContent {
  type: 'heading' | 'code' | 'table' | 'text' | 'list';
  content: string;
  level?: number;
  language?: string;
  rows?: string[][];
  items?: string[];
}

function detectCodeBlock(lines: string[], startIndex: number): { endIndex: number; language: string; code: string } | null {
  const line = lines[startIndex].trim();
  
  // Check if line starts with import, class, public, etc.
  const codeKeywords = ['import ', 'public class', 'class ', 'public static', 'private ', 'protected ', 'void ', 'int ', 'String ', 'return ', '{', '}'];
  const isCodeStart = codeKeywords.some(keyword => line.startsWith(keyword));
  
  if (!isCodeStart) return null;
  
  let codeLines: string[] = [];
  let braceCount = 0;
  let i = startIndex;
  let language = 'java'; // Default to Java
  
  // Detect language from import statements
  if (line.includes('import java')) language = 'java';
  else if (line.includes('import ') || line.includes('from ')) language = 'python';
  else if (line.includes('#include')) language = 'cpp';
  
  while (i < lines.length) {
    const currentLine = lines[i];
    codeLines.push(currentLine);
    
    // Count braces to detect end of code block
    braceCount += (currentLine.match(/{/g) || []).length;
    braceCount -= (currentLine.match(/}/g) || []).length;
    
    // If we've closed all braces and have at least 3 lines, end the code block
    if (braceCount === 0 && codeLines.length >= 3 && i > startIndex) {
      return { endIndex: i, language, code: codeLines.join('\n') };
    }
    
    i++;
    
    // Safety: don't go beyond 100 lines
    if (i - startIndex > 100) break;
  }
  
  return null;
}

function isHeading(line: string): { isHeading: boolean; level: number } {
  const trimmed = line.trim();
  
  // Check for numbered headings like "1. Topic Name (10 Marks)"
  if (/^\d+\.\s+.+\(\d+\s*Marks?\)/i.test(trimmed)) {
    return { isHeading: true, level: 1 };
  }
  
  // Check for headings ending with (10 Marks) or similar
  if (/\(\d+\s*Marks?\)$/i.test(trimmed) && trimmed.length < 100) {
    return { isHeading: true, level: 1 };
  }
  
  // Check for "10-MARK ANSWER" pattern
  if (/^\d+-MARK/i.test(trimmed)) {
    return { isHeading: true, level: 2 };
  }
  
  // Check for UNIT headers
  if (/^UNIT\s*[-–—]\s*\d+/i.test(trimmed)) {
    return { isHeading: true, level: 1 };
  }
  
  // Check for section headers (all caps, short lines)
  if (trimmed === trimmed.toUpperCase() && trimmed.length > 5 && trimmed.length < 60 && /^[A-Z\s&–—-]+$/.test(trimmed)) {
    return { isHeading: true, level: 2 };
  }
  
  // Check for "PROGRAM" keyword
  if (/^PROGRAM/i.test(trimmed)) {
    return { isHeading: true, level: 3 };
  }
  
  // Check for subtopic patterns (starts with number or letter followed by period/parenthesis)
  if (/^[\d]+\.\s+[A-Z]/.test(trimmed) && trimmed.length < 100) {
    return { isHeading: true, level: 3 };
  }
  
  return { isHeading: false, level: 1 };
}

function detectList(lines: string[], startIndex: number): { endIndex: number; items: string[] } | null {
  const line = lines[startIndex].trim();
  
  // Check if line starts with bullet point or dash
  if (!line.match(/^[-•·▪▫→✓✔]\s+/) && !line.match(/^\d+\.\s+[a-z]/)) {
    return null;
  }
  
  const items: string[] = [];
  let i = startIndex;
  
  while (i < lines.length) {
    const currentLine = lines[i].trim();
    
    if (currentLine.match(/^[-•·▪▫→✓✔]\s+/) || currentLine.match(/^\d+\.\s+[a-z]/)) {
      items.push(currentLine.replace(/^[-•·▪▫→✓✔]\s+/, '').replace(/^\d+\.\s+/, ''));
      i++;
    } else if (currentLine === '') {
      break;
    } else {
      break;
    }
  }
  
  if (items.length > 0) {
    return { endIndex: i - 1, items };
  }
  
  return null;
}

export function parseText(text: string): ParsedContent[] {
  if (!text.trim()) return [];
  
  const lines = text.split('\n');
  const result: ParsedContent[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
      i++;
      continue;
    }

    // Check for markdown headings first
    const markdownHeadingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (markdownHeadingMatch) {
      result.push({
        type: 'heading',
        level: markdownHeadingMatch[1].length,
        content: markdownHeadingMatch[2],
      });
      i++;
      continue;
    }

    // Check for markdown code blocks
    const codeStartMatch = line.match(/^```(\w+)?$/);
    if (codeStartMatch) {
      const language = codeStartMatch[1] || 'plaintext';
      const codeLines: string[] = [];
      i++;
      
      while (i < lines.length && !lines[i].match(/^```$/)) {
        codeLines.push(lines[i]);
        i++;
      }
      
      result.push({
        type: 'code',
        language,
        content: codeLines.join('\n'),
      });
      i++; // Skip closing ```
      continue;
    }

    // Check for markdown tables
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableLines: string[] = [line];
      i++;
      
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      
      const rows = tableLines
        .filter(l => !l.match(/^\|[\s-:|]+\|$/))
        .map(l => 
          l.split('|')
            .slice(1, -1)
            .map(cell => cell.trim())
        );
      
      if (rows.length > 0) {
        result.push({
          type: 'table',
          content: '',
          rows,
        });
      }
      continue;
    }

    // Auto-detect headings
    const headingCheck = isHeading(line);
    if (headingCheck.isHeading) {
      result.push({
        type: 'heading',
        level: headingCheck.level,
        content: trimmed,
      });
      i++;
      continue;
    }

    // Auto-detect code blocks
    const codeBlock = detectCodeBlock(lines, i);
    if (codeBlock) {
      result.push({
        type: 'code',
        language: codeBlock.language,
        content: codeBlock.code,
      });
      i = codeBlock.endIndex + 1;
      continue;
    }

    // Auto-detect lists
    const list = detectList(lines, i);
    if (list) {
      result.push({
        type: 'list',
        content: '',
        items: list.items,
      });
      i = list.endIndex + 1;
      continue;
    }

    // Regular text
    if (trimmed) {
      result.push({
        type: 'text',
        content: trimmed,
      });
    }
    i++;
  }

  return result;
}
