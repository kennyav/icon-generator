import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { b64Image } from "~/data/b64";
import { env } from "~/env.mjs";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
   credentials: {
      accessKeyId: env.ACCESS_KEY_ID,
      secretAccessKey: env.SECRET_ACCESS_KEY,
   },
   region: "us-west-1",
});

import {
   createTRPCRouter,
   protectedProcedure,
} from "~/server/api/trpc";

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
   apiKey: env.DALLE_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateIcon(prompt: string): Promise<string | undefined> {
   if (env.MOCK_DALLE === "true") {
      //return "https://oaidalleapiprodscus.blob.core.windows.net/private/org-TSaqNe5VyWkHeh1MqjchNczv/user-FvOZOD5HdBZ541msLUNIpYOU/img-DcpbDpNsw2TuxSyOhpCk9ev8.png?st=2023-06-13T02%3A15%3A36Z&se=2023-06-13T04%3A15%3A36Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-06-12T20%3A39%3A33Z&ske=2023-06-13T20%3A39%3A33Z&sks=b&skv=2021-08-06&sig=loWtlCAtmKh1T2vqBRwZc/AhcgS5vNqycnwtyLgrqrI%3D";
      return b64Image;
   } else {
      const response = await openai.createImage({
         prompt,
         n: 1,
         size: "512x512",
         response_format: "b64_json",
      });
      return response.data.data[0]?.b64_json;
   }
}

export const generateRouter = createTRPCRouter({
   generateIcon: protectedProcedure.input(
      z.object({
         prompt: z.string(),
         bgColor: z.string(),
         style: z.string(),
      })
   )
      .mutation(async ({ ctx, input }) => {
         const { count } = await ctx.prisma.user.updateMany({
            where: {
               id: ctx.session.user.id,
               credits: {
                  gte: 1
               },
            },
            data: {
               credits: {
                  decrement: 1
               }
            }
         });

         if (count <= 0) {
            throw new TRPCError({
               code: "BAD_REQUEST",
               message: "You don't have enough credits to generate an icon."
            });
         }

         let finalPrompt = "";
         if (input.style === "metallic") {
            finalPrompt = `an icon of ${input.prompt} in light blue metallic iridescent material, 3D render isometric perspective on dark ${input.bgColor} background`
         } else if (input.style === "monochromatic") {
            finalPrompt = `${input.prompt} 3d character in flat monochromatic colors with matching single ${input.bgColor} color background`
         }

         console.log(finalPrompt);


         const base64EncodedImg = await generateIcon(finalPrompt)

         const BUCKET_NAME = "icon-generator-kenny";

         const icon = await ctx.prisma.icon.create({
            data: {
               prompt: finalPrompt,
               userId: ctx.session.user.id,
            }
         });

         await s3.putObject({
            Bucket: BUCKET_NAME,
            Body: Buffer.from(base64EncodedImg!, "base64"),
            Key: icon.id,
            ContentEncoding: "base64",
            ContentType: "image/gif",
         }, (err, data) => {
            if (err) {
               console.log(err);
            } else {
               console.log(data);
            }
         }).promise();



         return {
            imageUrl: `https://${BUCKET_NAME}.s3.us-west-1.amazonaws.com/${icon.id}`
         }
      })
});

