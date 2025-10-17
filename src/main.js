import * as readline from "readline";
import * as colors from "./modules/colors.js";
import * as utils from "./modules/utils.js";

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

    console.log("\nWaiting for input...");

      const key = await utils.getChar();
      

    if (!key) {
      running = false;
      break;
    }

    if (key.name === "1") {
      console.log("\nYou selected option 1: Start Game (Press any key to return)");
      await utils.getChar();
    } else if (key.name === "2") {
      console.log("\nYou selected option 2: See Stats (Press any key to return)");
      await utils.getChar();
    } else if (key.name === "3") {
      console.log("\nYou selected option 3: Settings (Press any key to return)");
      await utils.getChar();
    } else if (key.name === "escape" || (key.ctrl && key.name === "c")) {
      console.log("\nExiting program...");
      running = false;
    } else {
      console.log(`\nInvalid option '${key.name || key.sequence}' (Press any key to return)`);
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
