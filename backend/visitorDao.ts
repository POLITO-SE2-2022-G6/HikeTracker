import { Point, PrismaClient } from '@prisma/client'
import { checkPrime } from 'crypto'

const prisma = new PrismaClient()

type HikeQuery = {
  difficulty?: string,
  city?: string,
  region?: string,
  province?: string,
  length?: number,
  ascent?: number,
  expected_time?: number
}
export async function hikesList(fields: HikeQuery) {
  return prisma.hike.findMany({
    where: {
      AND: [
        {
          Difficulty: fields.difficulty,
          Length: fields.length,
          Ascent: fields.ascent,
          Expected_time: fields.expected_time
        },
        {
          OR: [
            {
              Start_point: {
                City: fields.city,
                Region: fields.region,
                Province: fields.province
              }
            }, {
              End_point: {
                City: fields.city,
                Region: fields.region,
                Province: fields.province
              }
            }
          ]
        }
      ]
    }
  })
}