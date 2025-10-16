import prisma from "../../lib/prisma/prisma.js";

export async function get_by_user_id_service(user_id) {
    const files = await prisma.files.findMany({
        where: {
            user_id: user_id
        },
        include: {
            category: true
        }
    });

    return files;
}
