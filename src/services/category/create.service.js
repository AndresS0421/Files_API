import prisma from "../../lib/prisma/prisma.js";

export async function create_service(category) {
    const created_category = await prisma.categories.create({
        data: {
            name: category.name,
            ...(category?.description && {description: category.description})
        }
    });

    return created_category;
}