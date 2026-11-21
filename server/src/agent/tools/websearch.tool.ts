import {tavily} from "@tavily/core";
import { env } from "../../config/env.js";


const tvly = tavily({
  apiKey: env.TAVILY_API_KEY,
})


export const webSearch = async ({query, site}: {query: string, site?:string}) => {

  const finalSite = site?.trim()
                      .replace(/^site:\s*/i, "")   // remove site: if site has
                      .replace(/^https?:\/\//, "") // remove https://
                      .replace(/^www\./, "")       // remove www.
                      .replace(/\/$/, "");

  const finalQuery = finalSite ? `site:${finalSite} ${query}` : query;
  // console.log("Tavily query:", finalQuery);

  const response = await tvly.search(finalQuery, {
    searchDepth: "advanced",
    maxResults: 5,
    topic: "general",
  });
  
  console.log("WebSearchResult:", response.results[0]?.title);
  return response.results.map((result) => ({
    title: result.title,
    url: result.url,
    content: result.content,
  }));
}



export const webSearchTool = {
  type: "function" as const,
  function: {
    name: "web_search",
    description: "Search the web for current information, recent developments, news, technical documentation, and factual questions. If the user wants results from a specific website, provide the website separately using the site parameter.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "A specific web search query. Include relevant keywords when useful.",
        },
        site: {
          type: "string",
          description: "Optional website/domain or URL to restrict the search, for example 'docs.langchain.com'"
        }
      },
      required: ["query"]
    }
  }
}
