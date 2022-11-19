import { Point, PrismaClient } from '@prisma/client'
import { PointQuery, createPoint, editPoint } from './pointDao'

const prisma = new PrismaClient()

export type HikeQuery = {
  difficulty?: number,
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
          Difficulty: {
            lt: fields.difficulty
          },
          Length: {
            lt: fields.length
          },
          Ascent: {
            lt: fields.ascent
          },
          Expected_time: {
            lt: fields.expected_time
          }
        },
        {
          OR: [
            {
              Start_point: {
                City: fields.city && { startsWith: fields.city },
                Region: fields.region && { startsWith: fields.region },
                Province: fields.province && { startsWith: fields.province }
              }
            }, {
              End_point: {
                City: fields.city && { startsWith: fields.city },
                Region: fields.region && { startsWith: fields.region },
                Province: fields.province && { startsWith: fields.province }
              }
            }
          ]
        }
      ]
    }
  })
}

export async function hikeById(id: number, field: PointQuery) {
  const hike = await prisma.hike.findUnique({where: {id}});
  if (!hike) return null;

  const points = await prisma.point.findMany({
    include: {
      hikes: {
        where: {
          id: hike.id
      }
    }
  },
  where: {
    OR: [
      {
        HutId: field.parking_lot? field.hut? { gte: 0 } : -1 : {gte:0}
      },
      {
        ParkingLotId: field.hut? field.parking_lot? { gte: 0 } : -1 : {gte:0}
      } 
      ]
    }
  })
  return {hike, points}
}

export const createHike = async (hike: Record<string, string>) => {
  const { title, length, expected_time, ascent, difficulty, gpstrack } = hike;

  return prisma.hike.create(
    {
      data: {
        Title: title,
        Length: parseFloat(length),
        Expected_time: parseInt(expected_time),
        Ascent: parseFloat(ascent),
        Difficulty: parseInt(difficulty),
        GpsTrack: gpstrack,
      },
    }
  );
};

export const editHike = async (idp: number, params: Record<string, string>, idH: number) => {
  const { title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpstrack } = params;

  return prisma.hike.update({
    where: {
      id: idp,
    },
    data: {
      Title: title,
      Length: parseFloat(length),
      Expected_time: parseInt(expected_time),
      Ascent: parseFloat(ascent),
      Difficulty: parseInt(difficulty),
      /*
      StartPointId: start_point?.id || undefined, 
      EndPointId: end_point?.id || undefined, 
      Reference_points: {
        create :[
        reference_points || undefined
      ]},
      */
      GpsTrack: gpstrack || undefined,
      LocalGuideId: idH || undefined
    }
  })
};
