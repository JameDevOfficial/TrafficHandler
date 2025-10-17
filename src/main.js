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
      await handleTrafficGame();
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

async function handleTrafficGame() {
  utils.clearScreen();
  colors.print_c("Welcome to the traffic game!", colors.ansiColors.BoldCyan);
  console.log("You will have to control the binary data flow.");
  console.log("   - While the traffic light is green, send the data.");
  console.log(
    "   - If it turns yellow/red, immediatly stop. \nYour internet service provider doesn't like it when you let data flow during red light. \nIf you violate to often, you may loose your access to the internet and the game ends.\n"
  );
  console.log("Press any key to start the data flow.");
  await utils.getChar();
  console.log("Great!");
  await printTrafficLight(2);
  console.log("\n\nPress any key to continue...");
  await utils.getChar();
  return;
}

function printTrafficLight(color) {
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
                 '--.______.--'`);
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
