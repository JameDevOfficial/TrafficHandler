// Accepts a color options object mapping color names to ANSI codes
export function print_c(
    text,
    format,
    reset = true,
    newLine = true
) {
    let printText = format + text;
    if (reset) {
        printText += "\x1b[0m"; 
    }
    if (newLine) {
        printText += "\n";
    }
    process.stdout.write(printText);
}

export const ansiColors = {
    // Regular Colors
    Black: "\x1b[0;30m",
    Red: "\x1b[0;31m",
    Green: "\x1b[0;32m",
    Yellow: "\x1b[0;33m",
    Blue: "\x1b[0;34m",
    Purple: "\x1b[0;35m",
    Cyan: "\x1b[0;36m",
    White: "\x1b[0;37m",
    
    // Bold
    BoldBlack: "\x1b[1;30m",
    BoldRed: "\x1b[1;31m",
    BoldGreen: "\x1b[1;32m",
    BoldYellow: "\x1b[1;33m",
    BoldBlue: "\x1b[1;34m",
    BoldPurple: "\x1b[1;35m",
    BoldCyan: "\x1b[1;36m",
    BoldWhite: "\x1b[1;37m",
    
    // Underline
    UnderlineBlack: "\x1b[4;30m",
    UnderlineRed: "\x1b[4;31m",
    UnderlineGreen: "\x1b[4;32m",
    UnderlineYellow: "\x1b[4;33m",
    UnderlineBlue: "\x1b[4;34m",
    UnderlinePurple: "\x1b[4;35m",
    UnderlineCyan: "\x1b[4;36m",
    UnderlineWhite: "\x1b[4;37m",
    
    // Background
    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgPurple: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
    
    // High Intensity
    HighIntensityBlack: "\x1b[0;90m",
    HighIntensityRed: "\x1b[0;91m",
    HighIntensityGreen: "\x1b[0;92m",
    HighIntensityYellow: "\x1b[0;93m",
    HighIntensityBlue: "\x1b[0;94m",
    HighIntensityPurple: "\x1b[0;95m",
    HighIntensityCyan: "\x1b[0;96m",
    HighIntensityWhite: "\x1b[0;97m",
    
    // Bold High Intensity
    BoldHighIntensityBlack: "\x1b[1;90m",
    BoldHighIntensityRed: "\x1b[1;91m",
    BoldHighIntensityGreen: "\x1b[1;92m",
    BoldHighIntensityYellow: "\x1b[1;93m",
    BoldHighIntensityBlue: "\x1b[1;94m",
    BoldHighIntensityPurple: "\x1b[1;95m",
    BoldHighIntensityCyan: "\x1b[1;96m",
    BoldHighIntensityWhite: "\x1b[1;97m",
    
    // High Intensity Backgrounds
    HighIntensityBgBlack: "\x1b[0;100m",
    HighIntensityBgRed: "\x1b[0;101m",
    HighIntensityBgGreen: "\x1b[0;102m",
    HighIntensityBgYellow: "\x1b[0;103m",
    HighIntensityBgBlue: "\x1b[0;104m",
    HighIntensityBgPurple: "\x1b[0;105m",
    HighIntensityBgCyan: "\x1b[0;106m",
    HighIntensityBgWhite: "\x1b[0;107m",
    
    // Other Styles
    Bold: "\x1b[1m",
    Italic: "\x1b[3m",
    Underline: "\x1b[4m",
    Strikethrough: "\x1b[9m",
    
    // Reset
    Reset: "\x1b[0m",
};
