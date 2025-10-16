import prisma from "../../lib/prisma/prisma.js";

export async function get_all_service() {
    const files = await prisma.files.findMany({
        include: {
            category: true
        }
    });

    return files;
}
