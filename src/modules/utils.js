import * as colors from "./colors.js";
import * as readline from "readline";

export function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
export function printDecoLine(format = null) {
    if (format != null && colors) {
        colors.print_c(
            "--------------------------------------",
            format,
            true,
            true
        );
    } else {
        console.log("--------------------------------------");
    }
}

export function clearScreen() {
    //console.log("\x1b[2J");
    //console.clear();
    process.stdout.write("\x1bc\x1b[3J");
}

export function getChar() {
    if (!process.stdin.isTTY) {
        return Promise.resolve(null);
    }

    readline.emitKeypressEvents(process.stdin);

    return new Promise((resolve) => {
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }

        const listener = (str, key) => {
            process.stdin.removeListener("keypress", listener);

            if (process.stdin.isTTY) {
                process.stdin.setRawMode(false);
            }

            resolve(key);
        };

        process.stdin.on("keypress", listener);
    });
}

let count = 0;
let running = false;
export let dotAnimation = {
    async start() {
        running = true;
        while (running == true) {
            if (count >= 3) {
                readline.moveCursor(process.stdout, -3, 0);
                readline.clearLine(process.stdout, 1);
                count= 0;
            }
            process.stdout.write(".");
            count++;
            await sleep(500);
        }
    },

    stop() {
        running = false;
        count = 0;
        readline.moveCursor(process.stdout, -3, 0);
        readline.clearLine(process.stdout, 1);
        console.log("...");
    },
};
