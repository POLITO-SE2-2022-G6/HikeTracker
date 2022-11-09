import { Point, PrismaClient } from '@prisma/client'
import { checkPrime } from 'crypto'

const prisma = new PrismaClient()

export type HikeQuery = {
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

export type Hike = {
  title: string,
  length: number,
  expected_time: number,
  ascent: number,
  difficulty: string, 
  start_point: Point, 
  end_point: Point, 
  reference_point: Point[],
  description: string, 
  gpstrack?: string
}

export const createHike = async (hike:Hike) => {
  const { title, length, expected_time, ascent, difficulty, start_point, end_point, reference_point, description, gpstrack } = hike;

  //how to handle refPoints?

  const point_s = await prisma.point.create({
      data: {
        Label: start_point.Label,
        Latitude: start_point.Latitude, 
        Longitude: start_point.Longitude,
        Elevation: start_point.Elevation, 
        City: start_point.City,
        Region: start_point.Region, 
        Province: start_point.Province,
        Type: start_point.Type,
        Description: start_point.Description,
      }
  })

  const point_e = await prisma.point.create({
    data: {
      Label: end_point.Label,
      Latitude: end_point.Latitude, 
      Longitude: end_point.Longitude,
      Elevation: end_point.Elevation, 
      City: end_point.City,
      Region: end_point.Region, 
      Province: end_point.Province,
      Type: end_point.Type,
      Description: end_point.Description,
    }
})
 
  return prisma.hike.create(
      {
          data: {
              Title : title,
              Length : length, 
              Expected_time : expected_time, 
              Ascent : ascent,
              Difficulty : difficulty, 
              StartPointId: point_s.id, 
              EndPointId: point_e.id,            
              Description : description, 
              GpsTrack : gpstrack,
          },
      }
  );
  
};