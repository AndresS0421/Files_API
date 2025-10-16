import prisma from "../../lib/prisma/prisma.js";

export async function update_service(id, file) {
    const updated_file = await prisma.files.update({
        where: {
            id: id
        },
        data: {
            url: file.url,
            description: file.description,
            user_id: file.user_id,
            category_id: file.category_id
        },
        include: {
            category: true
        }
    });

    return updated_file;
}
