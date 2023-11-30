import { NextFunction, Request, Response } from 'express';
import path from "path";
import fs from "fs";
import User from "../model/User";

const userDataPath  = path.join(__dirname , '../../dev-data/data/users.json');
const dataString = fs.readFileSync( userDataPath , 'utf-8');
const data : User[]= JSON.parse(dataString);


const getAllUser = (req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const createUser = (req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const getUserById = (req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const updateUserById = (req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const deleteUserById = (req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

export { getAllUser, createUser, getUserById, updateUserById, deleteUserById };
