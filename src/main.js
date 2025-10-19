import * as readline from "readline";
import * as colors from "./modules/colors.js";
import * as utils from "./modules/utils.js";
import { player } from "./player.js";
import { traffic } from "./traffic.js";

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    let userName;
    let running = true;

    await new Promise((resolve) => {
        rl.question(`How would you like to be called? `, (name) => {
            userName = name;
            rl.close();
            resolve();
        });
    });
    process.stdin.resume();

    while (running) {
        utils.clearScreen();
        menuScreen(userName);

        process.stdout.write("\nWaiting for input");
        utils.dotAnimation.start();

        const key = await utils.getChar();
        await utils.dotAnimation.stop();
        if (!key) {
            running = false;
            break;
        }

        if (key.name === "1") {
            await handleTrafficGame();
        } else if (key.name === "2") {
            console.log(
                "\nYou selected option 2: See Stats (Press any key to return)"
            );
            await utils.getChar();
        } else if (key.name === "3") {
            console.log(
                "\nYou selected option 3: Settings (Press any key to return)"
            );
            await utils.getChar();
        } else if (key.name === "escape" || (key.ctrl && key.name === "c")) {
            console.log("\nExiting program...");
            running = false;
        } else {
            console.log(
                `\nInvalid option '${
                    key.name || key.sequence
                }' (Press any key to return)`
            );
            await utils.getChar();
        }
    }
    process.exit();
}
main();

function menuScreen(name, highScore = 0) {
    utils.clearScreen();
    colors.print_c(
        `.-----------------------------------.
|                                   |
|  _____           __  __ _      _  |
| |_   _| __ __ _ / _|/ _(_) ___| | |
|   | || '__/ _' | |_| |_| |/ __| | |
|   | || | | (_| |  _|  _| | (__|_| |
|   |_||_|  \\__,_|_| |_| |_|\\___(_) |
|                                   |
'-----------------------------------'`,
        colors.ansiColors.Blue
    );
    colors.print_c("Hello " + name + "!", colors.ansiColors.Green);
    console.log("Your High Score: " + highScore);
    utils.printDecoLine();
    console.log("1. Start Game");
    console.log("2. See Stats");
    console.log("3. Settings");
    utils.printDecoLine();
}

async function handleTrafficGame() {
    await traffic.printTrafficGameHead();
    process.stdout.write("Press any key to start ");
    utils.dotAnimation.start();
    await utils.getChar();
    await utils.dotAnimation.stop();
    await utils.clearScreen();
    traffic.drawGameHeader();
    await traffic.printTrafficLight(traffic.trafficLight.color);
    traffic.printStatus();
    traffic.trafficLight.start();
    await traffic.playBinaryDataAnimation();
    traffic.trafficLight.stop();
    return;
}



/*console.log(`                       ##
                      _[]_
                     [____]
                 .----'  '----.
             .===|    .==.    |===.
             \\   |   /####\\   |   /
             /   |   \\####/   |   \\
             '===|    '""'    |==='
             .===|    .==.    |===.
             \\   |   /$$$$\\   |   /
             /   |   \\$$$$/   |   \\
             '===|    '""'    |==='
             .===|    .==.    |===.
             \\   |   /&&&&\\   |   /
             /   |   \\&&&&/   |   \\
             '===|    '""'    |==='
                 '--.______.--'`);*/
