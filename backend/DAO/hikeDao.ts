import { Point, PrismaClient, Hike } from '@prisma/client'

const prisma = new PrismaClient()

type HikeQuery = {
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
          difficulty: {
            lt: fields.difficulty
          },
          length: {
            lt: fields.length
          },
          ascent: {
            lt: fields.ascent
          },
          expected_time: {
            lt: fields.expected_time
          }
        },
        {
          OR: [
            {
              start_point: {
                city: fields.city && { startsWith: fields.city },
                region: fields.region && { startsWith: fields.region },
                province: fields.province && { startsWith: fields.province }
              }
            }, {
              end_point: {
                city: fields.city && { startsWith: fields.city },
                region: fields.region && { startsWith: fields.region },
                province: fields.province && { startsWith: fields.province }
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
      start_point: {
        include: {
          parkinglot: true,
          hut: true
        }
      },
      end_point: {
        include: {
          parkinglot: true,
          hut: true
        }
      },
      reference_points: true
    }
  });
}

export const createHike = async (hike: any) => {
  const { title, length, expected_time, ascent, difficulty, gpstrack, description, localguideid, startpointid, endpointid } = hike;

  return prisma.hike.create(
    {
      data: {
        title: title,
        length: length,
        expected_time: expected_time,
        ascent: ascent,
        difficulty: difficulty,
        description: description,
        gpstrack: gpstrack,
        start_point: startpointid ? {
          connect: {
            id: startpointid
          }
        } : undefined,
        end_point: endpointid ? {
          connect: {
            id: endpointid
          }
        } : undefined,
        localguide: localguideid ? { connect: { id: localguideid } } : undefined,
      },
    }
  );
};

type newHike = Hike & { reference_points: { created: Point[], deleted: number[] } };
export const editHike = async (idp: number, params: newHike) => {
  const { title, length, expected_time, ascent, difficulty, description, startpointid, endpointid, reference_points, gpstrack, localguideid } = params;

  return prisma.hike.update({
    where: {
      id: idp,
    },
    data: {
      title: title,
      length: length,
      expected_time: expected_time,
      ascent: ascent,
      difficulty: difficulty,
      description: description,
      start_point: startpointid ? {
        connect: {
          id: startpointid
        }
      } : undefined,
      end_point: endpointid ? {
        connect: {
          id: endpointid
        }
      } : undefined,
      gpstrack: gpstrack || undefined,
      localguide: {
        connect: {
          id: localguideid ? localguideid : undefined
        }
      },
      reference_points: reference_points ? {
        connect: reference_points.created.map((p) => ({ id: p.id })),
        deleteMany: reference_points.deleted.map(id => ({ id }))
      } : undefined
    },
    include: {
      reference_points: true,
      start_point: true,
      end_point: true,
    }
  })
};
