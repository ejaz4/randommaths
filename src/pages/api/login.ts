import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../libs/prisma";
import bcrypt from "bcrypt"
import { encodeBase64 } from "../../../libs/base64";
import { generateRandomString } from "../../../libs/secureString";

type LoginPOSTRequest = {
  email: string;
  password: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // Process a POST request
    const { email, password } = req.body as LoginPOSTRequest;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
      }
    }).catch((error) => {
      res.status(400).json({ message: error.message });
    });

    if (user) {
      const { password: hashedPassword } = user;

      const isPasswordCorrect = bcrypt.compareSync(password, hashedPassword);

      if (isPasswordCorrect) {
        var id = encodeBase64(user.id);
        var randomElement = generateRandomString(64);
        var token = id + "." + randomElement;

        await prisma.token.create({
          data: {
            token,
            userId: user.id,
          },
        }).then((token) => {
          res.send({
            token: token.token
          })
        });
      } else {
        res.status(400).json({ message: "Password is incorrect" });
      }
    }
  }
}
