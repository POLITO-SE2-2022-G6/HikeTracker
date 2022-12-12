import { PrismaClient, Prisma } from '@prisma/client'

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

export type FromForm<T> = {
  [k in keyof T]: string
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
      reference_points: true,
      huts: {
        include: {
          point: true
        }
      },
    }
  });
}

export type newHike = Prisma.HikeCreateInput & { huts: { created: number[], deleted: number[] }, reference_points: { created: number[], deleted: number[] }, startpointid: number, endpointid: number, localguideid: number };
export const createHike = async (hike: newHike) => {
  const { huts, reference_points, title, length, expected_time, ascent, difficulty, gpstrack, description, localguideid, startpointid, endpointid } = hike;

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
        huts: huts ? { connect: huts.created.map((p) => ({ id: p })) } : undefined,
        reference_points: { create: reference_points.created },
        localguide: localguideid ? { connect: { id: localguideid } } : undefined,
      },
    }
  );
};

export const editHike = async (idp: number, params: Partial<newHike>) => {
  const { huts, title, length, expected_time, ascent, difficulty, description, startpointid, endpointid, reference_points, gpstrack, localguideid, conditions, conddescription } = params;
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
      conditions: conditions,
      conddescription: conddescription,
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
        create: reference_points.created,
        delete: reference_points.deleted.map((p) => ({ id: p }))
      } : undefined,
      huts: huts ? {
        connect: huts.created.map((p) => ({ id: p })),
        disconnect: huts.deleted.map((p) => ({ id: p }))
      } : undefined
    }
  })
};

export const deleteHike = async (id: number) => {
  return prisma.hike.delete({
    where: {
      id: id,
    },
  });
};
