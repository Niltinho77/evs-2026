const { execSync } = require("node:child_process");

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

try {
  run("npx prisma migrate deploy");
} catch (e) {
  // Se der erro de conexão temporária no boot, você vai ver no log.
  // Mas geralmente roda liso.
  process.exit(1);
}

run("npx prisma generate");
run("npx next start");