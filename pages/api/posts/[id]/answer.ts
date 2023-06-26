import { withApiSession } from "@libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
    body: { answer },
  } = req;
  const post = await client.post.findUnique({
    where: {
      id: +id!.toString(),
    },
    select: {
      id: true,
    },
  });

  const newAnswr = await client.answer.create({
    data: {
      user: {
        connect: {
          id: user?.id,
        },
      },
      post: {
        connect: {
          id: +id!.toString(),
        },
      },
      answer,
    },
  });

  res.json({
    ok: true,
    answer: newAnswr,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
