import prisma from "../../lib/prisma/prisma.js";

export async function delete_service(id) {
    const deleted_file = await prisma.files.delete({
        where: {
            id: id
        }
    });

    return deleted_file;
}
