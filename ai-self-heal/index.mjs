import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Repo root is one level up from ai-self-heal by default
const repoRoot = process.env.REPO_ROOT || path.resolve(__dirname, "..");

function runCommand(cmd, args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd: options.cwd || repoRoot,
      shell: true,
      env: { ...process.env, ...(options.env || {}) },
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      const text = data.toString();
      stdout += text;
      process.stdout.write(text);
    });

    child.stderr.on("data", (data) => {
      const text = data.toString();
      stderr += text;
      process.stderr.write(text);
    });

    child.on("close", (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

function readFileSafe(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch (e) {
    return null;
  }
}

function findFirstErrorFile(stderr) {
  // Very simple pattern: ./path/to/file.tsx:line:col
  const regex = /(\.?[\/][^\s:]+\.(?:js|jsx|ts|tsx|mjs|cjs)):(\d+):(\d+)/;
  const match = stderr.match(regex);
  if (!match) return null;
  return {
    relativePath: match[1],
    line: match[2],
    column: match[3],
  };
}

async function main() {
  console.log("🔧 AI Self-Heal: starting build check...");

  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY is not set. Skipping AI self-heal.");
    // Run a normal build so the workflow still behaves like usual
    const result = await runCommand("npm", ["run", "build"]);
    process.exit(result.code ?? 1);
  }

  // 1. Run the build
  console.log("🏗️ Running `npm run build` from repo root:", repoRoot);
  const buildResult = await runCommand("npm", ["run", "build"]);

  if (buildResult.code === 0) {
    console.log("✅ Build succeeded. Nothing to fix.");
    process.exit(0);
  }

  console.log("❌ Build failed. Collecting context for AI...");

  const errorLog = buildResult.stderr || buildResult.stdout || "No error output captured.";
  const pkgJsonPath = path.join(repoRoot, "package.json");
  const packageJson = readFileSafe(pkgJsonPath) || "package.json not found";
  const nextConfig = readFileSafe(path.join(repoRoot, "next.config.js")) ||
                     readFileSafe(path.join(repoRoot, "next.config.mjs")) ||
                     readFileSafe(path.join(repoRoot, "next.config.cjs")) ||
                     "No next.config.* found";

  const errorFileInfo = findFirstErrorFile(errorLog);
  let errorFileContent = null;
  if (errorFileInfo) {
    const possiblePath = path.join(repoRoot, errorFileInfo.relativePath.replace(/^\.\//, ""));
    errorFileContent = readFileSafe(possiblePath);
    console.log("📄 Using error file for context:", possiblePath);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const systemPrompt = `
You are an expert full-stack TypeScript/Next.js engineer.
Your job is to fix build errors automatically.

Given:
- The build error log
- package.json
- next.config.* (if present)
- Optionally the first file that appears in the error log

Output:
- ONLY a unified git patch (diff) that can be applied with \`git apply\` from the repository root.
- The patch MUST start with: \`diff --git\`
- Do not wrap the patch in backticks.
- Do not add explanations or commentary.
If no safe patch is possible, output an empty string.
`.trim();

  let userPrompt = [
    "ERROR LOG:",
    "```text",
    errorLog.substring(0, 8000),
    "```",
    "",
    "PACKAGE.JSON:",
    "```json",
    packageJson.substring(0, 8000),
    "```",
    "",
    "NEXT CONFIG (if any):",
    "```js",
    nextConfig.substring(0, 8000),
    "```",
  ].join("\n");

  if (errorFileInfo && errorFileContent) {
    userPrompt += [
      "",
      "",
      `FIRST ERROR FILE: ${errorFileInfo.relativePath} (line ${errorFileInfo.line}, col ${errorFileInfo.column})`,
      "```ts",
      errorFileContent.substring(0, 8000),
      "```",
    ].join("\n");
  }

  console.log("🧠 Asking OpenAI for a patch...");

  let completion;
  try {
    completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
    });
  } catch (err) {
    console.error("❌ Failed to contact OpenAI:", err);
    process.exit(1);
  }

  const aiText = (completion.choices?.[0]?.message?.content || "").trim();
  if (!aiText) {
    console.error("⚠️ OpenAI returned empty response. No patch to apply.");
    process.exit(buildResult.code ?? 1);
  }

  const diffIndex = aiText.indexOf("diff --git");
  if (diffIndex === -1) {
    console.error("⚠️ No 'diff --git' found in AI response. Full response was:");
    console.error(aiText);
    process.exit(buildResult.code ?? 1);
  }

  const patchText = aiText.slice(diffIndex);

  const patchPath = path.join(repoRoot, "ai-fix.patch");
  fs.writeFileSync(patchPath, patchText, "utf8");
  console.log("💾 Wrote AI patch to", patchPath);

  try {
    console.log("📦 Applying patch with `git apply`...");
    execSync(`git apply "${patchPath}"`, {
      cwd: repoRoot,
      stdio: "inherit",
    });
  } catch (err) {
    console.error("❌ Failed to apply patch:", err);
    process.exit(buildResult.code ?? 1);
  } finally {
    try {
      fs.unlinkSync(patchPath);
    } catch (e) {
      // ignore
    }
  }

  // Commit & push changes
  try {
    const status = execSync("git status --porcelain", { cwd: repoRoot }).toString().trim();
    if (!status) {
      console.log("ℹ️ No changes after applying patch. Nothing to commit.");
      process.exit(buildResult.code ?? 1);
    }

    console.log("📝 Committing AI fix...");
    execSync('git config user.name "ai-self-heal-bot"', { cwd: repoRoot });
    execSync('git config user.email "ai-self-heal-bot@example.com"', { cwd: repoRoot });
    execSync('git commit -am "[ai-fix] automatic fix for build error"', {
      cwd: repoRoot,
      stdio: "inherit",
    });

    console.log("🚀 Pushing AI fix to remote...");
    execSync("git push", { cwd: repoRoot, stdio: "inherit" });

    console.log("✅ AI fix pushed. A new CI/Vercel run will be triggered.");
    // We still exit with non-zero so the original run is marked as failed,
    // but the follow-up run (on the AI commit) should (hopefully) succeed.
    process.exit(buildResult.code ?? 1);
  } catch (err) {
    console.error("❌ Failed to commit/push AI fix:", err);
    process.exit(buildResult.code ?? 1);
  }
}

main().catch((err) => {
  console.error("Unexpected error in AI self-heal script:", err);
  process.exit(1);
});
