import { linkOAuthAccount, findUserByOAuth, unlinkOAuthAccount } from '../../utils/db-auth'

export default defineEventHandler(async (event) => {
  // 需要用户已登录
  const session = await requireUserSession(event)

  const body = await readBody(event)
  const { provider, providerAccountId, accessToken, refreshToken } = body

  if (!provider || !providerAccountId) {
    throw createError({
      statusCode: 400,
      message: '缺少必要的参数',
    })
  }

  // 检查该 OAuth 账户是否已被其他用户绑定
  const existingAccount = await findUserByOAuth(provider, providerAccountId)

  if (existingAccount && existingAccount.id !== session.user.id) {
    throw createError({
      statusCode: 409,
      message: '该账户已被其他用户绑定',
    })
  }

  // 绑定 OAuth 账户
  await linkOAuthAccount(
    session.user.id,
    provider,
    providerAccountId,
    accessToken,
    refreshToken
  )

  return { success: true }
})
