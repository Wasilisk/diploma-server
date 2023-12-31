import { PrismaClient } from '@prisma/client';
import { directions } from './mock-data';
const prisma = new PrismaClient();
async function main() {
  await prisma.direction.createMany({
    data: directions,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
