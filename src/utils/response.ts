import { Response } from "express";

export const successResponse = (
  res: Response,
  message: string,
  data: any = {},
  status:any,
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  message: string,
  status:any,
  errors: any = null
) => {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
};
