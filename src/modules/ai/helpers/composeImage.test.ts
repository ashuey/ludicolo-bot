import fs from "fs";
import path from "path";
import {composeInspirationImage} from "./composeImage";

const testBg = fs.readFileSync(path.join(__dirname, 'test_bg.png'));

test('combines image and text', async () => {
    const outImg = await composeInspirationImage(
        testBg,
        "The best way to AFK in Limsa is with style; glamour is always the true endgame."
    );

    expect(outImg.toString('base64')).toMatchSnapshot();
});
