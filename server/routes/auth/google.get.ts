import { findUserByOAuth, createUser, linkOAuthAccount, findUserByEmail } from '../../utils/db-auth'

export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['openid', 'email', 'profile'],
  },
  async onSuccess(event, { user }) {
    // 先查找是否已有该 OAuth 账户
    let dbUser = await findUserByOAuth('google', user.sub)

    if (dbUser) {
      // 已存在，直接登录
      await setUserSession(event, {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          avatar: dbUser.picture,
          role: dbUser.role,
          hasPassword: !!dbUser.password,
        },
      })
      return
    }

    // 查找是否已有相同邮箱的用户
    dbUser = await findUserByEmail(user.email)

    if (dbUser) {
      // 已存在用户，绑定 Google 账户
      await linkOAuthAccount(
        dbUser.id,
        'google',
        user.sub,
        user.accessToken,
        user.refreshToken
      )
      await setUserSession(event, {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          avatar: dbUser.picture,
          role: dbUser.role,
          hasPassword: !!dbUser.password,
        },
      })
      return
    }

    // 创建新用户并绑定 Google 账户
    const newUser = await createUser({
      email: user.email,
      name: user.name,
      avatar: user.picture,
    })

    await linkOAuthAccount(
      newUser.id,
      'google',
      user.sub,
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
    console.error('Google OAuth error:', error)
  },
})
