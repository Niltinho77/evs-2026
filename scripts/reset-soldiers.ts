import { prisma } from "../src/lib/prisma";

async function main() {
  const result = await prisma.soldier.deleteMany();
  console.log(`🔥 Soldados removidos: ${result.count}`);
}

main()
  .catch((e) => {
    console.error("Erro ao limpar soldados:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });