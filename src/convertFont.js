import fs from "fs";

const fontPath = "./fonts/DejaVuSerif.ttf"; // path to your TTF
const outputPath = "./fonts/DejaVuSerif.base64.js";

const fontData = fs.readFileSync(fontPath);
const base64 = fontData.toString("base64");

fs.writeFileSync(outputPath, `export default "${base64}";\n`);

console.log("Font converted!");
