import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface PointQuery {
    latitude?: number,
    longitude?: number,
    elevation?: number
}
export async function getPList(fields: PointQuery){
  return prisma.point.findMany({
    where: {
        Latitude:{
            gt: fields.latitude ? fields.latitude-10 : undefined,
            lt: fields.latitude ? fields.latitude+10 : undefined,
        },
        Longitude:{
            gt: fields.longitude? fields.longitude-10:undefined,
            lt: fields.longitude? fields.longitude+10:undefined
        },
        Elevation:{
            gt: fields.elevation? fields.elevation-10 : undefined,
            lt: fields.elevation? fields.elevation+10 : undefined
        }
    }
  })
}

interface HikeQuery {
  difficulty?: string, 
  length?: number, 
  ascent?: number, 
  expected_time?: number
}
export async function hikesList(fields: HikeQuery) {
  return prisma.hike.findMany({
    where: {
        Difficulty: fields.difficulty,
        Length: fields.length,
        Ascent: fields.ascent,
        Expected_time: fields.expected_time
    }
  })
}