import type { Request, Response, NextFunction } from "express";
import ResponseHttp from "../../../app/http/response.http.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listTeachers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teachers = await prisma.teacherProfile.findMany({
            include: { user: true }
        });
        return res.status(200).json(ResponseHttp.success("Teachers retrieved", teachers));
    } catch (error) { next(error); }
};

export const listStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const students = await prisma.studentProfile.findMany({
            include: { user: true }
        });
        return res.status(200).json(ResponseHttp.success("Students retrieved", students));
    } catch (error) { next(error); }
};
