import prisma from "../../lib/prisma/prisma.js";

export async function get_by_id_service(id) {
    const category = await prisma.categories.findUnique({
        where: {
            id: id
        }
    });

    return category;
}