import {NextRequest, NextResponse} from 'next/server'
import {Document, Schema} from 'mongoose'
import cloudinary from '@/utilities/cloudinary'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import getSessionUser from '@/utilities/getSessionUser'
import propertyModel from '@/models/propertyModel'
import {ListedProperty, RegisteredUser} from '@/utilities/interfaces'
import {e401, e500, redirect, s200} from '@/utilities/responses'
export {dynamic} from '@/utilities/dynamic'
/**
 * @name    GET
 * @desc    GET all properties
 * @route   GET /api/properties
 * @access  public
 */
export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    await connectToMongoDB()
    return s200(JSON.stringify(await propertyModel.find()))
  } catch (error: any) {
    return e500(
      'retrieving properties',
      error
    )
  }
}
/**
 * @name    POST
 * @desc    Add a property
 * @route   POST /api/properties
 * @access  private
 */
export const POST = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const user: RegisteredUser | null = await getSessionUser()
    if (user) {
      const form: FormData = await request.formData()
      const property: Document<unknown, {}, ListedProperty> & Required<{_id: Schema.Types.ObjectId}> = new propertyModel({
        owner: user._id,
        type: form.get('type')?.valueOf(),
        name: form.get('name')?.valueOf(),
        description: form.get('description')?.valueOf(),
        location: {
          street: form.get('location.street')?.valueOf(),
          city: form.get('location.city')?.valueOf(),
          state: form.get('location.state')?.valueOf(),
          zipcode: form.get('location.zipcode')?.valueOf()
        },
        beds: form.get('beds')?.valueOf(),
        baths: form.get('baths')?.valueOf(),
        square_feet: form.get('square_feet')?.valueOf(),
        amenities: form.getAll('amenities').map((amenity: FormDataEntryValue) => amenity.valueOf()),
        rates: {
          nightly: form.get('rates.nightly')?.valueOf(),
          weekly: form.get('rates.weekly')?.valueOf(),
          monthly: form.get('rates.monthly')?.valueOf()
        },
        seller_info: {
          name: form.get('seller_info.name')?.valueOf(),
          email: form.get('seller_info.email')?.valueOf(),
          phone: form.get('seller_info.phone')?.valueOf()
        },
        images: await Promise.all(form.getAll('files').map(async (image: FormDataEntryValue): Promise<string> => (await cloudinary.uploader.upload(
          `data:image/png;base64,${Buffer.from(new Uint8Array(await (image as File).arrayBuffer())).toString('base64')}`,
          {folder: process.env.CLOUDINARY_FOLDER_NAME ?? ''}
        )).secure_url))
      })
      await connectToMongoDB()
      await property.save()
      return redirect(`${process.env.NEXTAUTH_URL}/properties/${property._id}`)
    } else {
      return e401
    }
  } catch (error: any) {
    return e500(
      'adding property',
      error
    )
  }
}