import { getCurrentDateAndTime } from "./current-datetime.tool.js";
import { webSearch } from "./websearch.tool.js";
import { createAndWriteFile } from "./writefile.tool.js";


const executeTool = {

  web_search: ({query, site}: {query: string, site?: string}) => {
    const args = site ? {query, site} : {query};
    return webSearch(args);
  },

  get_current_datetime: () => {
    return getCurrentDateAndTime();
  },

  write_file: (args: {filename: string, content: string})=> {
    return createAndWriteFile(args.filename, args.content);
  },

}


export default executeTool;
