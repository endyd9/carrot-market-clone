import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import twilio from "twilio";
import emailjs from "emailjs-com";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { email, phone },
  } = req;
  const user = email ? { email } : phone ? { phone } : null;
  if (!user) return res.json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });

  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.MESSAGING_SID,
    //   to: process.env.PHONE_NUMBER!,
    //   from: process.env.TWILIO_NUMBER,
    //   body: `your login token is ${payload}`,
    // });
    console.log(payload);
  }
  if (email) {
    // const templateParams = {
    //   to_name: "뚜용스",
    //   message: payload,
    // };
    // await emailjs
    //   .send(
    //     process.env.EMAILJS_SERVICE_KYE!,
    //     process.env.EMAILJS_TAMPLATE!,
    //     templateParams,
    //     process.env.EMAILJS_ID
    //   )
    //   .then(
    //     function (response) {
    //       console.log("SUCCESS!", response.status, response.text);
    //     },
    //     function (error) {
    //       console.log("FAILED...", error);
    //     }
    //   );
    console.log(payload);
  }

  return res.json({
    ok: true,
  });
}

export default withHandler({ method: "POST", handler, isPrivate: false });
