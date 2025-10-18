import * as readline from "readline";
import * as colors from "./modules/colors.js";
import * as utils from "./modules/utils.js";

const BSTRING_LENGTH=200;
const RED_LIGHT=5; //chance in % 

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
  colors.print_c("You will have to toggle the binary data flow by pressing any key.", colors.ansiColors.Bold);
  console.log("   - While the traffic light is green, send the data.");
  console.log(
    "   - If it turns yellow/red, immediatly stop. \nYour internet service provider doesn't like it when you let data flow during red light. \nIf you violate to often, you may loose your access to the internet and the game ends.\n"
  );
  process.stdout.write("Press any key to start ");
  utils.dotAnimation.start();
  await utils.getChar();
  await utils.dotAnimation.stop();
  await printTrafficLight(2);
  await playBinaryDataAnimation();
  return;
} 

async function drawGameHeader(isFlowing, trafficLightColor) {
  utils.clearScreen();
  colors.print_c("Traffic Light Data Flow Control", colors.ansiColors.BoldCyan);
  console.log("Press any key to toggle the data flow on/off");
  console.log("Press ESC or Ctrl+C to exit back to menu\n");

  if (isFlowing) {
    colors.print_c("Status: FLOWING", colors.ansiColors.BoldGreen);
  } else {
    colors.print_c("Status: STOPPED", colors.ansiColors.BoldRed);
  }
  console.log("");
  printTrafficLight(trafficLightColor);
}

async function playBinaryDataAnimation() {
  let isFlowing = true;
  let running = true;
  let trafficLightColor = 2;
  

  let binaryStream = generateBinaryString(BSTRING_LENGTH);
  let streamPosition = BSTRING_LENGTH;
  const displayWidth = 80;

  drawGameHeader(isFlowing, trafficLightColor);
  console.log("\n");

  colors.print_c("Data Stream:", colors.ansiColors.BoldWhite);
  process.stdout.write("\n");

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  const keyListener = (str, key) => {
    if (key && (key.name === "escape" || (key.ctrl && key.name === "c"))) {
      running = false;
    } else if (key) {
      isFlowing = !isFlowing;
      process.stdout.write("\x1b[s");
      process.stdout.write("\x1b[5;1H");
      process.stdout.write("\x1b[2K");
      if (isFlowing) {
        process.stdout.write("\x1b[1;32mStatus: FLOWING\x1b[0m");
      } else {
        process.stdout.write("\x1b[1;31mStatus: STOPPED\x1b[0m");
      }
      process.stdout.write("\x1b[u");
    }
  };

  process.stdin.on("keypress", keyListener);

  while (running) {
    process.stdout.write("\x1b[1A");
    process.stdout.write("\x1b[2K");
    process.stdout.write("\r");

    let displayLine = "";
    for (let i = 0; i < displayWidth; i++) {
      const index = (streamPosition + i) % binaryStream.length;
      displayLine += binaryStream[index];
    }

    if (isFlowing) {
      colors.print_c(displayLine, colors.ansiColors.BoldCyan);
    } else {
      colors.print_c(displayLine, colors.ansiColors.Red);
    }

    if (isFlowing) {
      streamPosition--;
      if (streamPosition <= 0 ) {
        streamPosition = BSTRING_LENGTH;
        binaryStream = generateBinaryString(BSTRING_LENGTH);
      }
    }

    await utils.sleep(50);
  }

  process.stdin.removeListener("keypress", keyListener);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(false);
  }

  process.stdout.write("\nReturning to menu ...");
  await utils.sleep(1000);
}

function generateBinaryString(length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.random() > 0.5 ? "1" : "0";
  }
  return result;
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
