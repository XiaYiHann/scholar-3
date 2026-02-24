import chalk from "chalk";
import { WELCOME_ANIMATION } from "./asciiPatterns.js";

const MIN_WIDTH = 70;
const ART_COLUMN_WIDTH = 26;

function getWelcomeText() {
  return [
    chalk.white.bold("Welcome to Scholar-3"),
    chalk.dim("OPSX-inspired, spec-driven research workflow installer"),
    "",
    chalk.white("This setup will configure:"),
    chalk.dim("  • Skills (discover/experiment/apply/verify/paper)"),
    chalk.dim("  • Namespaced commands/prompts (scholar3:* / scholar3-*)"),
    "",
    chalk.white("Quick start after install:"),
    `  ${chalk.yellow("/scholar3:discover")}  ${chalk.dim("Idea spec + freeze gate")}`,
    `  ${chalk.yellow("/scholar3:experiment")} ${chalk.dim("Proposal scaffolding")}`,
    `  ${chalk.yellow("/scholar3:apply")}     ${chalk.dim("Execute tasks step-by-step")}`,
    "",
    chalk.cyan("Press Enter to select tools..."),
  ];
}

function renderFrame(artLines, textLines) {
  const maxLines = Math.max(artLines.length, textLines.length);
  const lines = [];

  for (let i = 0; i < maxLines; i += 1) {
    const artLine = artLines[i] || "";
    const textLine = textLines[i] || "";
    const paddedArt = artLine.padEnd(ART_COLUMN_WIDTH);
    lines.push(`\x1b[2K${chalk.cyan(paddedArt)}${textLine}`);
  }

  return lines.join("\n");
}

function canAnimate() {
  if (!process.stdout.isTTY) return false;
  if (!process.stdin.isTTY) return false;
  if (process.env.NO_COLOR) return false;
  const columns = process.stdout.columns || 80;
  if (columns < MIN_WIDTH) return false;
  return true;
}

function waitForEnter() {
  return new Promise((resolve) => {
    const { stdin } = process;
    if (!stdin.isTTY) {
      resolve();
      return;
    }

    const wasRaw = stdin.isRaw;
    stdin.setRawMode(true);
    stdin.resume();

    const onData = (data) => {
      const char = data.toString();
      if (char === "\r" || char === "\n" || char === "\u0003") {
        stdin.removeListener("data", onData);
        stdin.setRawMode(Boolean(wasRaw));
        stdin.pause();
        if (char === "\u0003") {
          process.stdout.write("\n");
          process.exit(0);
        }
        resolve();
      }
    };

    stdin.on("data", onData);
  });
}

export async function showWelcomeScreen() {
  const textLines = getWelcomeText();

  if (!canAnimate()) {
    const frame = WELCOME_ANIMATION.frames[WELCOME_ANIMATION.frames.length - 1];
    process.stdout.write("\n" + renderFrame(frame, textLines) + "\n\n");
    return;
  }

  let frameIndex = 0;
  let isFirstRender = true;

  const numContentLines = Math.max(WELCOME_ANIMATION.frames[0].length, textLines.length);
  const frameHeight = numContentLines + 1;
  const totalHeight = frameHeight + 1;

  process.stdout.write("\n");

  const interval = setInterval(() => {
    const frame = WELCOME_ANIMATION.frames[frameIndex];

    if (!isFirstRender) {
      process.stdout.write(`\x1b[${frameHeight}A`);
    }
    isFirstRender = false;

    process.stdout.write(renderFrame(frame, textLines) + "\n\n");
    frameIndex = (frameIndex + 1) % WELCOME_ANIMATION.frames.length;
  }, WELCOME_ANIMATION.interval);

  await waitForEnter();

  clearInterval(interval);

  process.stdout.write(`\x1b[${totalHeight}A`);
  for (let i = 0; i < totalHeight; i += 1) {
    process.stdout.write("\x1b[2K\n");
  }
  process.stdout.write(`\x1b[${totalHeight}A`);
}

