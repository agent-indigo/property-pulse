import {Model, Schema, model, models} from 'mongoose'
import {RegisteredUser} from '@/utilities/interfaces'
const UserSchema = new Schema<RegisteredUser>({
  email: {
    type: String,
    unique: true,
    required: [
      true,
      'Please provide your email address.'
    ]
  },
  username: {
    type: String,
    required: [
      true,
      'Please provide a user name.'
    ]
  },
  image: {type: String},
  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Property'
    }
  ]
}, {
  timestamps: true
})
const userModel: Model<RegisteredUser> = models.User || model<RegisteredUser>(
  'User',
  UserSchema
)
export default userModel