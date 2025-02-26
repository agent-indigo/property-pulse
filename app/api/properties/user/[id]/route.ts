import {
  NextRequest,
  NextResponse
} from 'next/server'
import propertyModel from '@/models/propertyModel'
import userModel from '@/models/userModel'
import connectToMongoDB from '@/utilities/connectToMongoDB'
import success200response from '@/httpResponses/success200response'
import error404response from '@/httpResponses/error404response'
import error500response from '@/httpResponses/error500response'
export const dynamic = 'force-dynamic'
/**
 * @name    GET
 * @desc    Get all properties listed by the given user
 * @route   GET /api/properties/user/:id
 * @access  public
 */
export const GET = async (
  request: NextRequest,
  {params}: any
): Promise<NextResponse> => {
  try {
    const {id}: any = await params
    await connectToMongoDB()
    return await userModel.findById(id) ? success200response(await propertyModel.find({
      owner: id
    })) : error404response('User')
  } catch (error: any) {
    return error500response(error)
  }
}