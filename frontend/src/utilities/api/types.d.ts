/**
 * Model Point
 * 
 */
 export type Point = {
  id: number
  Label: string | null
  Latitude: number | null
  Longitude: number | null
  Elevation: number | null
  City: string | null
  Region: string | null
  Province: string | null
  Type: string | null
  Description: string | null
}
/**
 * Model Hike
 * 
 */
export type Hike = {
  id: number
  Title: string
  Length: number
  Expected_time: number
  Ascent: number
  Difficulty: number
  StartPointId: number | null
  EndPointId: number | null
  Description: string | null
  GpsTrack: string | null
  LocalGuideId: number | null
}
/**
 * Model User
 * 
 */
export type User = {
  id: number
  type: string
  email: string
  username: string
  phoneNumber: string
}

export type UserCreateInput = {
  type: string
  email: string
  username: string
  phoneNumber: string
}

export type HikeCreateInput = {
  Title: string
  Length: number
  Expected_time: number
  Ascent: number
  Difficulty: number
  Description?: string | null
}
