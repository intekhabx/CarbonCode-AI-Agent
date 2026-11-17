import fs from "node:fs";
import path from "path";


export function createAndWriteFile(filename: string, content: string){
  try {
    const currentPath = import.meta.dirname;
    const targetPath = path.join(currentPath, "..", "..", "..", "public", `${filename}`);
    fs.writeFileSync(targetPath, content, "utf8");

    return `File ${filename} has been created successfully.`;
  } 
  catch (error) {
    throw new Error(`Failed to create file: ${error}`);
  }
}



export const createAndWriteFileTool = {
  type: "function" as const,
  function: {
    name: 'write_file',
    description: 'Creates a file or writes text content into a file in the public directory.',
    parameters: {
      type: "object",
      properties: {
        filename: {
          type: "string",
          description: "Name of the file with extension (e.g. 'index.html', 'styles.css')",
        },
        content: {
          type: "string",
          description: "The actual file content "
        }
      },
      required: ["filename", "content"],
    },
  },
}
