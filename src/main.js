import * as readline from "readline";
import * as colors from "./modules/colors.js";
import * as utils from "./modules/utils.js";


function main() {
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }
}
main();
process.stdin.on("keypress", (str, key) => {
    console.log("Pressed ", key.name);
});
while (true) {
    await utils.sleep(1000);
    console.log("1s passed");
}
