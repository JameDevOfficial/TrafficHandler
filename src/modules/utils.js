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

let dotAnimationInterval = null;
let dotCount = 0;
export let dotAnimation = {
    async start() {
        await this.stop();

        dotCount = 0;
        dotAnimationInterval = setInterval(() => {
            if (dotCount >= 3) {
                process.stdout.write("\b\b\b   \b\b\b");
                dotCount = 0;
            }
            process.stdout.write(".");
            dotCount++;
        }, 1000);
    },

    async stop() {
        if (dotAnimationInterval) {
            clearInterval(dotAnimationInterval);
            dotAnimationInterval = null;
        }
        if (dotCount > 0) {
            process.stdout.write(
                "\b".repeat(dotCount) +
                    " ".repeat(dotCount) +
                    "\b".repeat(dotCount)
            );
        }
        dotCount = 0;
        console.log("");
    },
};
