import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getUserById(id: number) {
    return await prisma.user.findUnique({ where: { id: id } })
}

export async function getUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email: email } })
}

export async function createUsr(type: string, username: string, email: string, phoneNumber: string, hutid: number, verificationCode: string) {
    return prisma.user.create({
        data: {
            type: type,
            username: username,
            email: email,
            phoneNumber: phoneNumber,
            hut: hutid ? {
                connect: {
                    id: hutid
                }
            } : undefined,
            performance: (type === 'hiker') ? { create: {} } : undefined,
            code: verificationCode
        },

    })
}

export async function verifyCode(email: string, code: string) {
    const u = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (u?.code === code) {
        return prisma.user.update({
            where: {
                email
            },
            data: {
                verified: true,
                code: undefined
            }
        })
    } else {
        throw new Error("Incorrect Code")
    }
}

