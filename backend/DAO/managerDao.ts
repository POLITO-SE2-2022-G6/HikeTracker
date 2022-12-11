import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const validateGuide= async(id:number)=>{
    return prisma.user.update({
        where: {id:id,},
        data:{
            verified:true,
        }
    })
}
export async function uGuidesList(){
    return prisma.user.findMany({
        where:{
         type:"guide" || "hworker",
         verified:false,
        }
    })
}