import { Point, PrismaClient } from '@prisma/client'
import { checkPrime } from 'crypto'

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
export async function hikeById(id: number) {
  return prisma.hike.findUnique( where:{id:id})}

export type Hike = {
  title: string,
  length: number,
  expected_time: number,
  ascent: number,
  difficulty: number, 
  start_point: Point, 
  end_point: Point, 
  reference_points: Point[],
  description: string, 
  gpstrack?: string
}

async function putP(p: Point) {
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
}

export const createHike = async (hike:Hike) => {
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
              Title : title,
              Length : length, 
              Expected_time : expected_time, 
              Ascent : ascent,
              Difficulty : difficulty, 
              /*
              StartPointId: point_s.id, 
              EndPointId: point_e.id,
              Reference_points: {
                connect: {   
                }
              },
              */            
              Description : description, 
              GpsTrack : gpstrack,
          },
      }
  );
  
};

export const editHike = async (idp:number, params: Hike) => {
  const { title, length, expected_time, ascent, difficulty, start_point, end_point, reference_points, description, gpstrack } = params;

  return prisma.hike.update({
    where: {
      id : idp,
    },
    data: {
      Title : title || undefined,
      Length: length || undefined, 
      Expected_time: expected_time || undefined, 
      Ascent: ascent || undefined, 
      Difficulty: difficulty || undefined,
      /*
      StartPointId: start_point?.id || undefined, 
      EndPointId: end_point?.id || undefined, 
      Reference_points: {
        create :[
        reference_points || undefined
      ]},
      */
      Description: description || undefined,
      GpsTrack: gpstrack || undefined,
    }
  })

  

};
