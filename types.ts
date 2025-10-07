
export interface CodeFile {
  name: string;
  content: string;
}

export interface GeneratedCode {
  files: CodeFile[];
  previewHtml: string;
}
