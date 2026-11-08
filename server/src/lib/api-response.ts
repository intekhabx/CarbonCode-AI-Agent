import type {Response} from "express";


class ApiResponse {

  public static created<Tdata>(res: Response, message: string, data: Tdata | null = null) {
    res.status(201).json({
      status: 201,
      message,
      data
    })
  }

  public static ok<Tdata>(res: Response, message: string, data: Tdata | null = null){
    res.status(200).json({
      status: 200,
      message,
      data
    })
  }

}

export default ApiResponse;
