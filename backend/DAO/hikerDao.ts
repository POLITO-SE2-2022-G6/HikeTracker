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

export async function assignHike(hikerId: number, hikeId: number, refPointId: number){
    return prisma.userHikes.create({
        data:{
            user: {
                connect: {
                    id: hikerId
                }
            },
            hike: {
                connect: {
                    id: hikeId
                }
            },
            refPoint: {
                connect: {
                    id: refPointId
                }
            }
        } 
    })
}

export async function modifyHike(id: number, status: string | undefined, refPointId: number | undefined){
    return prisma.userHikes.update({
        where: {
            id
        },
        data: {
            status,
            refPoint: {
                connect: {
                    id: refPointId
                }
            }
        }
    })
}

export async function getHike(id: number){
    return prisma.userHikes.findUnique({ where: { id }, include: { hike: { include: { reference_points: true, start_point: true, end_point: true } }, refPoint: true } })
}

export async function hikesListByUser(id: number, status: string | undefined){
    return prisma.userHikes.findMany({
        where: {
            user: {
                id
            },
            status: status ? status : undefined
        },
        include: {
            hike: true
        }
    })
}