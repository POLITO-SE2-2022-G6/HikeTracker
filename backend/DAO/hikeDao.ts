import { Point, PrismaClient, Hike } from '@prisma/client'
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
  }/*,
    where: {
      HutId: field.hut? {
        not: null
      }
        HutId: true}
         : undefined,  
    }
}*/})
  return {hike, points}
}


/*export type Hike = {
  title: string,
  length: number,
  expected_time: number,
  ascent: number,
  difficulty: number,
  start_point: Point,
  end_point: Point,
  reference_points: Point[],
  description: string,
  gpstrack?: string,
  localguideid?: number
}*/

/*async function putP(p: Point) {
  return prisma.point.create({
    data: {
      Label: p.Label,
      Latitude: p.Latitude,
      Longitude: p.Longitude,
      Elevation: p.Elevation,
      City: p.City,
      Region: p.Region,
      Province: p.Province,
      Type: p.Type,
      Description: p.Description,
    }
  })
}*/

export const createHike = async (hike: Record<string, string>) => {
  const { title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpstrack } = hike;
  /*
  const point_s = await putP(start_point);

  const point_e = await putP(end_point);
  */
  /*let point_r:int[];
  reference_points.forEach(async(p) =>{
    const pp = await getP(p);
    point_r =[...point_r,pp.id];
  })*/

  return prisma.hike.create(
    {
      data: {
        Title: title,
        Length: parseFloat(length),
        Expected_time: parseInt(expected_time),
        Ascent: parseFloat(ascent),
        Difficulty: parseInt(difficulty),
        /*
        StartPointId: point_s.id, 
        EndPointId: point_e.id,
        Reference_points: {
          connect: {   
          }
        },
        */
        //Description: description,
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
      //Description: description || undefined,
      GpsTrack: gpstrack || undefined,
      LocalGuideId: idH || undefined
    }
  })
};