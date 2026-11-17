import { createAndWriteFile,  } from "./writefile.tool.js"


const executeTool = {
  write_file: (args: {filename: string, content: string})=> {
    return createAndWriteFile(args.filename, args.content);
  },
}


export default executeTool;
