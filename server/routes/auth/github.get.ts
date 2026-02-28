import { findUserByOAuth, createUser, linkOAuthAccount, findUserByEmail } from '../../utils/db-auth'

export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user }) {
    // 先查找是否已有该 OAuth 账户
    let dbUser = await findUserByOAuth('github', user.id.toString())

    if (dbUser) {
      // 已存在，直接登录
      await setUserSession(event, {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          avatar: dbUser.avatar,
          role: dbUser.role,
          hasPassword: !!dbUser.password,
        },
      })
      return
    }

    // 查找是否已有相同邮箱的用户
    dbUser = await findUserByEmail(user.email)

    if (dbUser) {
      // 已存在用户，绑定 GitHub 账户
      await linkOAuthAccount(
        dbUser.id,
        'github',
        user.id.toString(),
        user.accessToken,
        user.refreshToken
      )
      await setUserSession(event, {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          avatar: dbUser.avatar,
          role: dbUser.role,
          hasPassword: !!dbUser.password,
        },
      })
      return
    }

    // 创建新用户并绑定 GitHub 账户
    const newUser = await createUser({
      email: user.email,
      name: user.name || user.login,
      avatar: user.avatar_url,
    })

    await linkOAuthAccount(
      newUser.id,
      'github',
      user.id.toString(),
      user.accessToken,
      user.refreshToken
    )

    await setUserSession(event, {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        avatar: newUser.avatar,
        role: newUser.role,
        hasPassword: !!newUser.password,
      },
    })
  },
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
  },
})
