import * as colors from "./colors.js";

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