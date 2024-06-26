import {Account, AuthOptions, Profile, Session, User} from 'next-auth'
import {JWT} from 'next-auth/jwt'
import {AdapterUser} from 'next-auth/adapters'
import {CredentialInput} from 'next-auth/providers/credentials'
import Google, {GoogleProfile} from 'next-auth/providers/google'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import userModel from '@/models/userModel'
import {RegisteredUser, UserSession} from '@/utilities/interfaces'
const authOptions: AuthOptions = {
  providers: [
    Google<GoogleProfile>({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '' as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '' as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    })
  ],
  callbacks: {
    async signIn(params: {
      user?: User | AdapterUser
      account?: Account | null
      profile?: Profile
      email?: {verificationRequest?: boolean}
      credentials?: CredentialInput
    }): Promise<boolean> {
      const {profile}: {profile?: Profile} = params
      await connectToMongoDB()
      const registeredUser: RegisteredUser | null = await userModel.findOne({email: profile?.email})
      if (!registeredUser) await userModel.create(profile)
      return true
    },
    async session(
      params: {
        session: Session
        token?: JWT
        user?: AdapterUser
      } & {
        newSession: UserSession
        trigger: 'update'
      }
    ): Promise<UserSession> {
      const {newSession}: {newSession: UserSession} = params
      if (newSession.user) {
        const registeredUser: RegisteredUser | null = await userModel.findOne({email: newSession.user.email})
        if (registeredUser) newSession.user._id = registeredUser._id.toString()
      }
      return newSession
    }
  }
}
export default authOptions