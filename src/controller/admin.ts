import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createAdmin = async () => {
  try {
    const isAdminExists = await prisma.admin.findFirst();
    if (!isAdminExists) {
      await prisma.admin.create({
        data: {
          userName: "admin",
          password: "admin@123",
          purchaseValue: 0,
        },
      });
    } else {
      console.log("Admin already exists");
      return;
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({
      message: "Username and password are required",
    });
    return;
  }
  try {
    const user = await prisma.admin.findUnique({
      where: {
        userName: username,
        password: password,
      },
    });
    if (user) {
      res.status(200).json({
        message: "Login Successful",
        user,
      });
    } else {
      res.status(203).json({
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
