import { NextFunction, RequestHandler, Request, Response } from "express";

export default ( func : Function ) : RequestHandler => {
  return (req : Request, res : Response, next : NextFunction) => {
    func(req, res, next).catch(next);
  }
}