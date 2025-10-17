import * as colors from "./colors.js";
import * as readline from "readline";


export function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
export function printDecoLine(format = null) {
    if (format != null && colors) {
        colors.print_c("--------------------------------------", format, true, true);
    } else {
        console.log("--------------------------------------");
    }
}

export function clearScreen() {
    console.log("\x1b[2J");
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