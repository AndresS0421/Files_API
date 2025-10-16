import prisma from "../../lib/prisma/prisma.js";

export async function get_by_user_id_service(user_id) {
    const tesis = await prisma.thesis.findMany({
        where: {
            user_id: user_id
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true
                }
            },
            thesisFiles: {
                select: {
                    id: true,
                    thesis_url: true,
                    created_at: true
                }
            }
        }
    });

    return tesis;
}