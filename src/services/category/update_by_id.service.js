import prisma from "../../lib/prisma/prisma.js";

export async function update_by_id(id, category) {
    const updated_category = await prisma.categories.update({
        where: {
            id: id
        },
        data: {
            name: category.name,
            description: category.description
        }
    });

    return updated_category;
}