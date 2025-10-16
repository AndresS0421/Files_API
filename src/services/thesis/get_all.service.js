import prisma from "../../lib/prisma/prisma.js";

export async function get_all_service(title, author, year, keywords) {
    const thesis_all = await prisma.thesis.findMany({
        where: {
            AND: [
                title ? { title: { contains: title }} : {},
                author ? { author: { contains: author }} : {},
                year ? { year: year } : {},
                keywords ? { key_words: { contains: keywords }}: {}
            ]
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true
                }
            },
            user: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    school: {
                        select: {
                            id: true,
                            name: true,
                            university: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            },
            thesisFiles: {
                select: {
                    id: true,
                    thesis_url: true,
                    created_at: true
                }
            }
        }
    });

    return thesis_all;
}