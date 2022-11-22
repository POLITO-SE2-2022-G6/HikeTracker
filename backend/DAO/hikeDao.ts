import { Point, PrismaClient, Hike, Prisma } from '@prisma/client'
import { PointQuery } from './pointDao'

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

export async function hikeById(id: number) {
  return prisma.hike.findUnique({
    where: { id },
    include: {
      Start_point: {
        include: {
          ParkingLot: true,
          Hut: true
        }
      },
      End_point: {
        include: {
          ParkingLot: true,
          Hut: true
        }
      },
      Reference_points: true
    }
  });
}

export const createHike = async (hike: Prisma.HikeCreateInput) => {
  const { Title, Length, Expected_time, Ascent, Difficulty, GpsTrack, Description } = hike;

  return prisma.hike.create(
    {
      data: {
        Title: Title,
        Length: Length,
        Expected_time: Expected_time,
        Ascent: Ascent,
        Difficulty: Difficulty,
        Description: Description,
        GpsTrack: GpsTrack,
      },
    }
  );
};

type newHike = Hike & { Reference_points: { created: Point[], deleted: number[] } };
export const editHike = async (idp: number, params: newHike, idH: number) => {
  const { Title, Length, Expected_time, Ascent, Difficulty, Description, StartPointId, EndPointId, Reference_points, GpsTrack } = params;

  return prisma.hike.update({
    where: {
      id: idp,
    },
    data: {
      Title: Title,
      Length: Length,
      Expected_time: Expected_time,
      Ascent: Ascent,
      Difficulty: Difficulty,
      Description: Description,
      Start_point: {
        connect: {
          id: StartPointId || undefined
        }
      },
      End_point: {
        connect: {
          id: EndPointId || undefined
        }
      },
      GpsTrack: GpsTrack || undefined,
      LocalGuide: {
        connect: {
          id: idH
        }
      },
      Reference_points: {
        create: Reference_points.created,
        deleteMany: Reference_points.deleted.map(id => ({ id }))
      }
    }
  });
};
