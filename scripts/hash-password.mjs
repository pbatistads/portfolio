import { emitKeypressEvents } from "node:readline";
import { hashPassword } from "../projects/server/passwords.mjs";

async function readPassword() {
  if (!process.stdin.isTTY) {
    let input = "";
    for await (const chunk of process.stdin) {
      input += chunk;
      if (Buffer.byteLength(input) > 4096) throw new Error("Entrada muito grande.");
    }
    return input.replace(/\r?\n$/, "");
  }
  process.stderr.write("Senha (mínimo 12 caracteres; entrada oculta): ");
  emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  return new Promise((resolve, reject) => {
    let password = "";
    const finish = () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.off("keypress", onKey);
      process.stderr.write("\n");
    };
    function onKey(text, key) {
      if (key?.ctrl && key.name === "c") { finish(); reject(new Error("Cancelado.")); }
      else if (key?.name === "return") { finish(); resolve(password); }
      else if (key?.name === "backspace") password = Array.from(password).slice(0, -1).join("");
      else if (text && !key?.ctrl && !key?.meta && Buffer.byteLength(password + text) <= 1024) password += text;
    }
    process.stdin.on("keypress", onKey);
    process.stdin.resume();
  });
}

try {
  const hash = await hashPassword(await readPassword());
  // Next.js expands $VAR even in quoted dotenv values. Escape $ for .env.local.
  console.log(process.argv.includes("--raw") ? hash : hash.replaceAll("$", "\\$"));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
