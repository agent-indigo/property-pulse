import {NextResponse} from 'next/server'
export const s200: Function = (content: string) => new NextResponse(
  content,
  {status: 200}
)
export const s204: Function = (message: string) => new NextResponse(
  message,
  {status: 204}
)
export const e401 = new NextResponse(
  'Unauthorized.',
  {status: 401}
)
export const e404: Function = (resource: string) => new NextResponse(
  `${resource} not found.`,
  {status: 404}
)
export const e500: Function = (
  error: any,
  action: string
) => new NextResponse(
  `Error ${action}:\n${error}`,
  {status: 500}
)
export const redirect: Function = (url: string) => NextResponse.redirect(url)