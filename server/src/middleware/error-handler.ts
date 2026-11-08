import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import ApiError from "../lib/api-error.js";



const globalErrorHandler:ErrorRequestHandler = (err, req, res, next)=>{
  // own apiError
  if(err instanceof ApiError){
    return res.status(err.status).json({
      success: false,
      message: err.message,
      code: err?.code,
    })
  }

  // zod error
  if(err instanceof ZodError){
    return res.status(400).json({
      success: false,
      message: err.message || "validation error",
      errors: err.issues
    })
  }

  // unexpected error
  console.error(err)
  return res.status(500).json({
    success: false,
    message: "internal server error",
  })
}


export default globalErrorHandler;