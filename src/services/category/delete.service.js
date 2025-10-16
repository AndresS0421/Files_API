import prisma from "../../lib/prisma/prisma.js";

export async function delete_service(id) {
    const deleted_category = await prisma.categories.delete({
        where: {
            id: id
        }
    });

    return deleted_category;
}