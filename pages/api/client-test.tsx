import { NextApiRequest, NextApiResponse } from "next";
import client from "../../libs/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await client.user.create({
    data: {
      email: "test@user.com",
      name: "testUser",
    },
  });
  res.json({ ok: true, data: "유저만들어따" });
}
