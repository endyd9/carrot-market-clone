import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { question, latitude, longitude },
    session: { user },
  } = req;

  if (req.method === "POST") {
    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    await res.revalidate("/community");

    res.json({
      ok: true,
      post,
    });
  }
  if (req.method === "GET") {
    const {
      query: { latitude, longitude },
    } = req;
    const parseLatitude = parseFloat(latitude!.toString());
    const parseLongitude = parseFloat(longitude!.toString());
    const posts = await client.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            Wondering: true,
            Answer: true,
          },
        },
      },
      where: {
        latitude: {
          gte: parseLatitude - 0.01,
          lte: parseLatitude + 0.01,
        },
        longitude: {
          gte: parseLongitude - 0.01,
          lte: parseLongitude + 0.01,
        },
      },
    });

    res.json({
      ok: true,
      posts,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
