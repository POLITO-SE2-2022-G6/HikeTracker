import { User, Performance, PrismaClient, Hike, Prisma } from '@prisma/client'


const prisma = new PrismaClient()


export const createPerformance = async (performance: any) => {
    const { length, duration, altitude, difficulty, hikerid } = performance;
    return prisma.performance.create({
        data: {
            length: length,
            duration: duration,
            altitude: altitude,
            difficulty: difficulty,
            hiker: {
                connect: {
                    id: hikerid
                }
            }

        }
    })
}
//ricevo l'id dell'hiker
export const editPerformance= async (idh:number,params:any)=>{
    const { length, duration, altitude, difficulty } = params;
    return prisma.performance.update({
        where: {
            id: idh
        },
        data: {
            length: length || undefined,
            duration: duration || undefined,
            altitude: altitude || undefined,
            difficulty: difficulty || undefined,          
        }
    })
}

export async function getPerformance(id: number){
    return prisma.performance.findUnique({ where:{ id } })
}
        

export async function deletePerformance(id: number){
    return prisma.performance.delete({
        where: {id}
    })
}