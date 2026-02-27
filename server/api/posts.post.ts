export default defineEventHandler(async (event) => {
  const body = await readBody<{ title: string; authorId: number; content?: string; published?: boolean }>(event);

  const post = await prisma.post.create({
    data: {
      title: body.title,
      content: body.content,
      published: body.published ?? false,
      authorId: body.authorId,
    },
    include: { author: true }
  });

  return post;
});
