const api: string = process.env.NEXT_PUBLIC_API_DOMAIN ?? ''
/**
 * @name    getProperties
 * @desc    GET all properties
 * @route   GET /api/properties
 * @access  public
 */
export const getProperties: Function = async (): Promise<any> => {
    try {
        if (api === '') {
            return []
        } else {
            const response: Response = await fetch(`${api}/properties`)
            if (response.ok) {
                return response.json()
            } else {
                throw new Error('Error fetching properties.')
            }
        }
    } catch (error) {
        console.error(`Error fetching properties:\n${error}`)
        return []
    }
}
/**
 * @name    getProperty
 * @desc    GET a single property
 * @route   GET /api/properties/:_id
 * @access  public
 */
export const getProperty: Function = async (id: string): Promise<any> => {
    try {
        if (api === '') {
            return null
        } else {
            const response: Response = await fetch(`${api}/properties/${id}`)
            if (response.ok) {
                return response.json()
            } else {
                throw new Error('Error fetching property.')
            }
        }
    } catch (error) {
        console.error(`Error fetching property:\n${error}`)
        return null
    }
}