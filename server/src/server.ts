import "dotenv/config";
import http from "node:http";
import createApplication from "./app.js";
import { env } from "./config/env.js";



function main(){

  const PORT = env.PORT;

  const app = createApplication();
  const server = http.createServer(app);

  
  server.listen(PORT, () => console.log(`Server is running on ${PORT}`));
}

main();
