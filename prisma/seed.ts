import { prisma } from '../server/utils/db'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

async function main() {
  console.log('开始种子数据生成...')

  // 密码哈希
  const adminPassword = await hashPassword('admin123')
  const userPassword = await hashPassword('user123')

  // 创建管理员账户
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: '管理员',
      password: adminPassword,
      avatar: null,
      role: 'ADMIN',
    },
  })
  console.log('创建管理员账户：admin@example.com')

  // 创建普通用户账户
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: '普通用户',
      password: userPassword,
      avatar: null,
      role: 'USER',
    },
  })
  console.log('创建普通用户账户：user@example.com')

  // 为管理员创建示例帖子
  await prisma.post.createMany({
    data: [
      {
        title: '管理员公告：欢迎来到本平台',
        content: '这是管理员发布的第一个公告，欢迎各位用户使用！',
        published: true,
        authorId: adminUser.id,
      },
      {
        title: '使用指南：如何高效管理待办事项',
        content: '1. 每天列出需要完成的任务\n2. 按优先级排序\n3. 完成后及时标记\n4. 定期回顾和整理',
        published: true,
        authorId: adminUser.id,
      },
    ],
  })
  console.log('创建管理员帖子')

  // 为普通用户创建示例帖子
  await prisma.post.createMany({
    data: [
      {
        title: '我的第一篇博客',
        content: '这是我的第一篇博客文章，记录一下使用心得。',
        published: true,
        authorId: regularUser.id,
      },
      {
        title: '草稿：未完成的文章',
        content: '这篇文章还在构思中...',
        published: false,
        authorId: regularUser.id,
      },
    ],
  })
  console.log('创建普通用户帖子')

  // 为普通用户创建示例 Todo
  await prisma.todo.createMany({
    data: [
      {
        title: '完成项目报告',
        completed: false,
        userId: regularUser.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 天后
      },
      {
        title: '购买生活用品',
        completed: true,
        userId: regularUser.id,
        dueDate: null,
      },
      {
        title: '学习新技术',
        completed: false,
        userId: regularUser.id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 天后
      },
    ],
  })
  console.log('创建普通用户 Todo')

  console.log('')
  console.log('种子数据生成完成！')
  console.log('')
  console.log('测试账户：')
  console.log('  管理员：admin@example.com / admin123')
  console.log('  普通用户：user@example.com / user123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
