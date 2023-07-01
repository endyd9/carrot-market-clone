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
      session: { user },
    } = req;

    const chatRooms = await client.chatRoom.findMany({
      where: {
        OR: [{ sellerId: user?.id }, { buyerId: user?.id }],
      },
      include: {
        seller: true,
        buyer: true,
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            message: true,
          },
          take: 1,
        },
      },
    });

    res.json({
      ok: true,
      chatRooms,
    });
  }

  if (req.method === "POST") {
    const {
      body: { product, seller, buyer },
    } = req;

    const allReadyExist = await client.chatRoom.findFirst({
      where: {
        sellerId: seller,
        buyerId: buyer,
        productId: product,
      },
    });

    if (allReadyExist) return res.json({ ok: true, allReadyExist });

    const chatRoom = await client.chatRoom.create({
      data: {
        seller: {
          connect: {
            id: seller,
          },
        },
        buyer: {
          connect: {
            id: buyer,
          },
        },
        product: {
          connect: {
            id: product,
          },
        },
      },
    });

    res.json({
      ok: true,
      chatRoom,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
