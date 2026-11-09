import type {Request, Response, NextFunction} from "express";
import type { ZodType } from "zod";

const validateInput = (dtoSchema: ZodType) => {

  return (req: Request, res: Response, next: NextFunction) => {

    const result = dtoSchema.safeParse(req.body);

    if(!result.success){
      res.status(400).json({
        success: false,
        // error: result.error.issues,
        message: result.error.issues[0]?.message
      })
    }

    req.body = result.data; //sanitized data
    next();
  };
};

export default validateInput;
