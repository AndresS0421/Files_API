import prisma from "../../lib/prisma/prisma.js";

export async function get_by_id_service(id) {
    const file = await prisma.files.findUnique({
        where: {
            id: id
        },
        include: {
            category: true
        }
    });

    return file;
}
