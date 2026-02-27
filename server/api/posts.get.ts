export default defineEventHandler(async () => {
  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { id: 'desc' }
  });
  return posts;
});
