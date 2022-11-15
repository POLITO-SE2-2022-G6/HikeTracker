import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getUserById(id: number) {
    return await prisma.user.findUnique({ where: { id: id } })
}

export async function getUserByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email: email } })
}

export async function createUsr(type: string, username: string, email: string, phoneNumber: string) {
    return prisma.user.create({
        data: {
            type: type,
            username: username,
            email: email,
            phoneNumber: phoneNumber
        }
    })
}

