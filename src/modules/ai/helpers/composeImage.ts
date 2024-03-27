import sharp from "sharp";

export async function composeInspirationImage(buffer: Buffer, cleanedInspiration: string) {
    const bg = sharp(buffer);

    const textLayer = sharp({
        text: {
            text: `<span foreground="white">${cleanedInspiration}</span>`,
            width: 600,
            height: 500,
            align: 'center',
            rgba: true,
        }
    });

    const xpanded = await textLayer.clone().extend({
        top: 50,
        left: 50,
        right: 50,
        bottom: 50,
        background: {r: 0, g: 0, b: 0, alpha: 0}
    }).png().toBuffer();

    const t = sharp(xpanded).clone().extractChannel("alpha")
        .blur(2).blur(3).negate()

    const t2 = sharp(await t.png().toBuffer())
        .unflatten();


    const t3 = sharp(await t2.png().toBuffer());

    const t4 = t3.composite([
        {
            input: {
                create: {
                    width: 1,
                    height: 1,
                    channels: 3,
                    background: {r: 0, g: 0, b: 0, alpha: 1},
                },
            },
            blend: "in",
            tile: true,
        },
        {
            input: xpanded,
            blend: "over",
        }
    ]);

    const bg2 = bg.composite([
        {
            input: await t4.png().toBuffer()
        }
    ]);

    return await bg2.png().toBuffer();
}
