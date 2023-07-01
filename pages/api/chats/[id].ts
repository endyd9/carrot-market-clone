import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { id },
    } = req;

    const chat = await client.chatRoom.findUnique({
      where: {
        id: +id!.toString(),
      },
      include: {
        product: {
          select: {
            name: true,
          },
        },
        messages: true,
      },
    });
    res.json({
      ok: true,
      chat,
    });
  }

  if (req.method === "POST") {
    const {
      body: { message },
      session: { user },
      query: { id },
    } = req;

    await client.message.create({
      data: {
        message,
        ChatRoom: {
          connect: {
            id: +id!.toString(),
          },
        },
        user: {
          connect: {
            id: user!.id,
          },
        },
      },
    });

    res.json({
      ok: true,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
