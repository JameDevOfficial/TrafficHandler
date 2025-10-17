import * as readline from "readline";
import * as colors from "./modules/colors.js";
import * as utils from "./modules/utils.js";

function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let userName;
  rl.question(`How would you like to be called? `, (name) => {
    userName = name;
    rl.close();
    menuScreen(userName);
  });

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  process.stdin.on("keypress", (str, key) => {
    if (key.name == "1") {
      console.log("You selected option 1: Start Game");
    } else if (key.name === "escape") {
      rl.close();
    }
  });

  process.stdin.resume();
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
