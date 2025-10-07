
export interface CodeFile {
  name: string;
  content: string;
}

export interface GeneratedCode {
  files: CodeFile[];
  previewHtml: string;
}

export interface Commit {
  id: string;
  message: string;
  code: GeneratedCode;
  createdAt: string;
}
