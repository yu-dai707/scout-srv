const { prisma } = require('../src/lib/prisma');
(async () => {
  // use project's prisma instance (configured with adapter)
  try {
    const rows = await prisma.candidate.findMany({ select: { id: true, name: true, email: true, createdAt: true }, take: 10 });
    console.log(JSON.stringify(rows, null, 2));
  } catch (e) {
    console.error('ERROR', e);
  } finally {
      // prisma instance from src/lib/prisma is shared; do not disconnect global instance here
  }
})();
