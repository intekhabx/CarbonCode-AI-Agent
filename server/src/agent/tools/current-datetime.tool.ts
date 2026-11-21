import { properties } from "zod";


export const getCurrentDateAndTime = () => {
  const obj =  {
    currentDateTime: new Date().toLocaleString("sv-SE", {timeZone: "Asia/Kolkata"}),
    timezone: "Asia/Kolkata"
  };

  console.log("Date&Time:", obj);
  return obj;
}



export const getCurrentDateAndTimeTool = {
  type: "function" as const,
  function: {
    name: "get_current_datetime",
    description: "Returns the current date and time in ISO format, with the timezone set to Asia/Kolkata (IST).",
  }
}
