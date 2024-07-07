import {Account, AuthOptions, Profile, Session, User} from 'next-auth'
import {JWT} from 'next-auth/jwt'
import {AdapterUser} from 'next-auth/adapters'
import {CredentialInput} from 'next-auth/providers/credentials'
import Google, {GoogleProfile} from 'next-auth/providers/google'
import {AuthorizationEndpointHandler, Provider} from 'next-auth/providers/index'
import {SignInAuthorizationParams} from 'next-auth/react'
import {Schema} from 'mongoose'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import userModel from '@/models/userModel'
import {AdapterUserWithId, RegisteredUser, SessionWithUserId} from '@/utilities/interfaces'
const authOptions: AuthOptions = {
  providers: [
    Google<GoogleProfile>({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '' as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '' as string,
      authorization: {
        params: {
          prompt: 'consent' as string,
          access_type: 'offline' as string,
          response_type: 'code' as string
        } as SignInAuthorizationParams
      } as AuthorizationEndpointHandler
    }) as Provider
  ] as Provider[],
  callbacks: {
    async signIn(params: {
      user?: User | AdapterUser
      account?: Account | null
      profile?: Profile | GoogleProfile | undefined
      email?: {verificationRequest?: boolean}
      credentials?: Record<string, CredentialInput>
    }): Promise<boolean> {
      const {profile}: {profile?: GoogleProfile} = params as {profile?: GoogleProfile}
      await connectToMongoDB() as void
      const registeredUser: RegisteredUser | null = await userModel.findOne({email: profile?.email as string}) as RegisteredUser | null
      if (!registeredUser) await userModel.create({
        email: profile?.email as string,
        username: profile?.name as string,
        image: profile?.picture as string
      } as RegisteredUser) as RegisteredUser
      return true as boolean
    },
    async session(
      params: {
        session: Session
        token?: JWT
        user?: AdapterUser
      } & {
        newSession: SessionWithUserId
        trigger: 'update'
      }
    ): Promise<SessionWithUserId> {
      const {newSession}: {newSession: SessionWithUserId} = params as {newSession: SessionWithUserId}
      await connectToMongoDB() as void
      const registeredUser: RegisteredUser = await userModel.findOne({email: newSession.user?.email as string}) as RegisteredUser
      const _id: Schema.Types.ObjectId = registeredUser._id as Schema.Types.ObjectId
      const id: string = _id.toString() as string
      newSession.user.id = id as string
      console.log(`_id                  : ${_id as Schema.Types.ObjectId}` as string) as void
      console.log(`_id.toString()       : ${id as string}` as string) as void
      console.log(`newSession.user.id   : ${newSession.user.id as string}` as string) as void
      console.log(`newSession.user.name : ${newSession.user.name as string}` as string) as void
      console.log(`newSession.user.email: ${newSession.user.email as string}` as string) as void
      console.log(`newSession.user.image: ${newSession.user.image as string}` as string) as void
      return newSession as SessionWithUserId
    }
  }
}
export default authOptions as AuthOptions