import prisma from "../../lib/prisma/prisma.js";

export async function get_all_service() {
    const categories = await prisma.categories.findMany();

    return categories;
}