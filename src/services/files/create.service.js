import prisma from "../../lib/prisma/prisma.js";

export async function create_service(file) {
    const created_file = await prisma.files.create({
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

    return created_file;
}
