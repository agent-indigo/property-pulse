import {
  Document,
  ObjectId
} from 'mongoose'
export default interface UserDocument extends Document {
  email: string
  username: string
  image?: string
  bookmarks: ObjectId[]
  roles: [
    'admin' | 'dev' | 'root' | 'user'
  ]
}