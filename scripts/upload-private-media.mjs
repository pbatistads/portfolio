import path from "node:path";
import { privateCases } from "../projects/server/private-media-manifest.mjs";
import { planUploads, uploadPlan } from "./private-upload.mjs";

// Dry-run never imports the SDK or makes a network call. No dotenv auto-loading.
try {
  const args = process.argv.slice(2);
  if (args.some(arg => !["--execute", "--dry-run"].includes(arg)) || (args.includes("--execute") && args.includes("--dry-run"))) throw new Error("Use --dry-run or --execute");
  const plan = await planUploads(privateCases, path.resolve("private/cases"), process.env.CASE_BLOB_PREFIX || "cases/v1");
  console.log(`Plano privado: ${plan.length} arquivos, ${plan.reduce((sum, item) => sum + item.size, 0)} bytes.`);
  if (!args.includes("--execute")) {
    console.log("Simulação concluída. Nenhuma leitura remota ou upload foi realizado.");
  } else {
    if (!process.env.BLOB_READ_WRITE_TOKEN && !(process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN)) throw new Error("Configure private Blob credentials outside source control");
    const result = await uploadPlan(plan, await import("@vercel/blob"));
    console.log(`Concluído: ${result.uploaded} enviados; ${result.skipped} já idênticos.`);
  }
} catch {
  // SDK errors may contain private URLs; never print them or a stack trace.
  console.error("Operação interrompida. Verifique argumentos, arquivos locais, credenciais e conflitos no armazenamento privado. Nenhum arquivo existente foi sobrescrito.");
  process.exitCode = 1;
}
