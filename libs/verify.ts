import { prisma } from "./prisma"

export const verifyToken = async(token: string) => {
    const tokenRecord = await prisma.token.findUnique({
        where: {
            token: token
        },
        select: {
            userId: true
        }
    }).catch((error) => {
        return {
            status: false,
            userId: null
        };
    });

    if (tokenRecord) {
        return {
            status: true,
            userId: tokenRecord.userId
        };
    }
    
    return {
        status: false,
        userId: null
    };
}