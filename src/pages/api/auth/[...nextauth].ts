import NextAuth from 'next-auth';
import { query as q } from 'faunadb';
import Providers from 'next-auth/providers';

import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    })
  ],
  callbacks: {
    async signIn(user, account, profile) {
      const { email } = user;

      try {
        await fauna.query(
          // If does not exists an user that email matchs to user.email
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            // Insert user email into users table on DB
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            // Else, just return the user existent
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )
        return true
      } catch {
        return false
      }
    },
  }
})
