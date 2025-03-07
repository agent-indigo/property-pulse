'use server'
import {revalidatePath} from 'next/cache'
import PropertyDocument from '@/interfaces/PropertyDocument'
import ServerActionResponse from '@/interfaces/ServerActionResponse'
import getSessionUser from './getSessionUser'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import propertyModel from '@/models/propertyModel'
import unauthorizedResponse from '@/serverActionResponses/unauthorizedResponse'
import notFoundResponse from '@/serverActionResponses/notFoundResponse'
import internalServerErrorResponse from '@/serverActionResponses/internalServerErrorResponse'
const editProperty: Function = async (
  propertyId: string,
  form: FormData
): Promise<ServerActionResponse> => {
  try {
    const {
      error,
      success,
      sessionUser
    }: ServerActionResponse = await getSessionUser()
    if (success && sessionUser) {
      await connectToMongoDB()
      const property: PropertyDocument | null = await propertyModel.findById(propertyId)
      if (property) {
        if (sessionUser._id === property.owner.toString()) {
          await propertyModel.findByIdAndUpdate(
            propertyId,
            Object.fromEntries(form.entries())
          )
          revalidatePath(
            '/',
            'layout'
          )
          return {
            message: 'Changes saved.',
            success: true
          }
        } else {
          return unauthorizedResponse
        }
      } else {
        return notFoundResponse('Property')
      }
    } else {
      return error ? internalServerErrorResponse(error) : unauthorizedResponse
    }
  } catch (error: any) {
    return internalServerErrorResponse(error)
  }
}
export default editProperty