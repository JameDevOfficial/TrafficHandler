import * as readline from "readline";
import * as colors from "./modules/colors.js";
import * as utils from "./modules/utils.js";
import { player } from "./player.js";

const BSTRING_LENGTH = 200;
const MAX_NPOINTS = 50;

export let traffic = {
    async printTrafficGameHead() {
        utils.clearScreen();
        colors.print_c(
            "Welcome to the traffic game!",
            colors.ansiColors.BoldCyan
        );
        colors.print_c(
            "You will have to toggle the binary data flow by pressing any key.",
            colors.ansiColors.Bold
        );
        console.log("   - While the traffic light is green, send the data.");
        console.log(
            "   - If it turns yellow/red, immediatly stop. \nYour internet service provider doesn't like it when you let data flow during red light. \nIf you violate to often, you may loose your access to the internet and the game ends.\n"
        );
    },

    trafficLight: {
        color: 2,
        running: false,
        sleepTimeout: null,
        rejectSleep: null,

        async sleep(ms) {
            return new Promise((resolve, reject) => {
                this.sleepTimeout = setTimeout(resolve, ms);
                this.rejectSleep = () => {
                    clearTimeout(this.sleepTimeout);
                    this.sleepTimeout = null;
                    reject(new Error("Traffic light stopped"));
                };
            });
        },

        async start() {
            if (this.running) return;

            this.running = true;
            this.color = 2;
            const min = 2000;
            const max = 5000;
            const redDif = 1000;

            try {
                while (this.running) {
                    let changeTime = Math.random() * (max - min) + min;
                    let nextChange =
                        changeTime - (this.color === 0 ? redDif : 0);
                    await this.sleep(nextChange);
                    if (this.color == 0) {
                        this.color = 2;
                    } else if (this.color == 2) {
                        this.color = 1;
                        traffic.drawFullGameScreen();
                        await this.sleep(Math.random() * 500 + 500);
                        this.color = 0;
                    }
                    traffic.drawFullGameScreen();
                }
            } catch (e) {
                if (e.message !== "Traffic light stopped")
                    console.error("Error while changing traffic lights: " + e);
            } finally {
                this.running = false;
                this.color = 2;
                this.sleepTimeout = null;
                this.rejectSleep = null;
                console.log("Traffic light stopped and state reset.");
            }
        },

        stop() {
            if (!this.running) return;
            this.running = false;
            if (this.rejectSleep) {
                this.rejectSleep();
            }
        },
    },

    async drawFullGameScreen() {
        utils.clearScreen();
        traffic.drawGameHeader();
        await traffic.printTrafficLight(this.trafficLight.color);
        traffic.printStatus();
        console.log("");
    },

    async drawGameHeader() {
        utils.clearScreen();
        colors.print_c(
            "Traffic Light Data Flow Control",
            colors.ansiColors.BoldCyan
        );
        console.log("Press any key to toggle the data flow on/off");
        console.log("Press ESC or Ctrl+C to exit back to menu");
        console.log();
    },

    isFlowing: true,

    printStatus() {
        colors.print_c("Data sent: " + player.points, colors.ansiColors.Cyan);
        colors.print_c(
            "Data illegaly sent: " + player.nPoints,
            colors.ansiColors.Red
        );
        if (this.isFlowing) {
            colors.print_c("Status: FLOWING", colors.ansiColors.BoldGreen);
        } else {
            colors.print_c("Status: STOPPED", colors.ansiColors.BoldRed);
        }
        console.log();
    },

    async playBinaryDataAnimation() {
        let running = true;

        let binaryStream = this.generateBinaryString(BSTRING_LENGTH);
        let streamPosition = BSTRING_LENGTH;
        const displayWidth = 80;

        readline.emitKeypressEvents(process.stdin);
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }

        const keyListener = (str, key) => {
            if (
                key &&
                (key.name === "escape" || (key.ctrl && key.name === "c"))
            ) {
                running = false;
            } else if (key) {
                this.isFlowing = !this.isFlowing;
                traffic.drawFullGameScreen();
            }
        };

        process.stdin.on("keypress", keyListener);

        while (running) {
            process.stdout.write("\x1b[5A");
            process.stdout.write("\r");
            process.stdout.write("\x1b[2K");
            this.printStatus();
            let displayLine = "";
            for (let i = 0; i < displayWidth; i++) {
                const index = (streamPosition + i) % binaryStream.length;
                displayLine += binaryStream[index];
            }

            if (this.isFlowing) {
                colors.print_c(displayLine, colors.ansiColors.BoldCyan);
            } else {
                colors.print_c(displayLine, colors.ansiColors.Red);
            }

            if (this.isFlowing) {
                streamPosition--;
                if (streamPosition <= 0) {
                    streamPosition = BSTRING_LENGTH;
                    binaryStream = this.generateBinaryString(BSTRING_LENGTH);
                }
            }

            this.calculatePoints(this.isFlowing, 1);
            await utils.sleep(50);
        }

        process.stdin.removeListener("keypress", keyListener);
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
        }

        process.stdout.write("\nReturning to menu ...");
        await utils.sleep(1000);
    },

    calculatePoints(isFlowing, multiplier = 1) {
        if (isFlowing) {
            if (this.trafficLight.color == 1 || this.trafficLight.color == 2) {
                player.points += 1 * multiplier;
            } else if (this.trafficLight.color == 0) {
                player.nPoints += 1 * multiplier;
            }
        }
    },

    generateBinaryString(length) {
        let result = "";
        for (let i = 0; i < length; i++) {
            result += Math.random() > 0.5 ? "1" : "0";
        }
        return result;
    },

    printTrafficLight(color) {
        let red = colors.ansiColors.Reset;
        let orange = colors.ansiColors.Reset;
        let green = colors.ansiColors.Reset;
        if (color == 0) red = colors.ansiColors.Red;
        else if (color == 1) orange = colors.ansiColors.Yellow;
        else if (color == 2) green = colors.ansiColors.Green;

        process.stdout.write(`                       ##
                      _[]_
                     [____]
                 .----'  '----.
             .===|    .==.    |===.
             \\   |   /`);
        colors.print_c("####", red, true, false);
        process.stdout.write(`\\   |   /
             /   |   \\`);
        colors.print_c("####", red, true, false);
        process.stdout.write(`/   |   \\
             '===|    '""'    |==='
             .===|    .==.    |===.
             \\   |   /`);
        colors.print_c("$$$$", orange, true, false);
        process.stdout.write(`\\   |   /
             /   |   \\`);
        colors.print_c("$$$$", orange, true, false);
        process.stdout.write(`/   |   \\
             '===|    '""'    |==='
             .===|    .==.    |===.
             \\   |   /`);
        colors.print_c("&&&&", green, true, false);
        process.stdout.write(`\\   |   /
             /   |   \\`);
        colors.print_c("&&&&", green, true, false);
        process.stdout.write(`/   |   \\
             '===|    '""'    |==='
                 '--.______.--'
`);
        return;
    },
};
