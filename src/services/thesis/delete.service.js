import prisma from "../../lib/prisma/prisma.js";

export async function delete_service(thesis_id) {
    const deleted_thesis = await prisma.thesis.delete({
        where: {
            id: thesis_id
        }
    });

    return deleted_thesis;
}