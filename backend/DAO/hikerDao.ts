import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()


//ricevo l'id dell'hiker
export const editPerformance= async (idh:number,params:any)=>{
    const { length, duration, altitude, difficulty } = params;
    return prisma.performance.update({
        where: {
            hikerid: idh
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
    return prisma.performance.findUnique({ where: { hikerid: id } })
}
        

export async function deletePerformance(id: number){
    return prisma.performance.delete({ where: { hikerid: id} })
}