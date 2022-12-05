import express, { Router } from "express";
import { checkSchema, validationResult } from 'express-validator';
import { isHiker } from "./authApi";
export const uRouter = Router();

