import { request } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../../libs/verify";
import { prisma } from "../../../../libs/prisma";

type ClassCreatePOSTRequest = {
    name: string;
}


const classCodeGeneration = () => {
  let classCode = "";

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
  for (let i = 0; i < 4; i++) {
    classCode += letters[Math.floor(Math.random() * letters.length)];
  }

  const numbers = "0123456789";

  for (let i = 0; i < 4; i++) {
    classCode += numbers[Math.floor(Math.random() * numbers.length)];
  }

  return classCode;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "POST") {
    // Check if token is provided
    const token = req.headers.authorization;

    // If no token provided
    if (!token) {
      // Return error
        return res.status(400).json({ message: "No token provided" });
    }

    // Verify token
    const verify = await verifyToken(token);
    
    // If token is invalid
    if (!verify) {
      // Return error
        return res.status(400).json({ message: "Token is invalid" });
    }

    // Get name from body
    const { name } = req.body as ClassCreatePOSTRequest;

    // If no name provided
    if (!name) {
      // Return error
        return res.status(400).json({ message: "Name is required" });
    }

    // Get user type
    const user = await prisma.user.findUnique({
      where: {
        id: verify.userId as string,

      },
      select: {
        type: true
      }
    });


    if (user) {
      //　Check if user is a teacher
      if (user.type !== "teacher") {
        // Return error
          return res.status(400).json({ message: "You are not a teacher" });
      }

      const classCode = classCodeGeneration();

      // Create class
      const newClass = await prisma.classAndOwner.create({
        data: {
          teacherId: verify.userId as string,
        }
      }).catch((error) => {
        console.log(error);
        // Return error
        return res.status(400).json({ message: "Something went wrong", error });
      })

      // Return success
      return res.status(200).json({ message: "Class created", class: newClass });
    } else {
      // Return error
        return res.status(400).json({ message: "User not found" });
    }
  }
}