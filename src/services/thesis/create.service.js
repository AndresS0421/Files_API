import prisma from "../../lib/prisma/prisma.js";

export async function create_service(thesis) {
    const thesis_result = await prisma.thesis.create({
        data: {
            title: thesis.title,
            author: thesis.author,
            year: thesis.year,
            abstract: thesis.abstract,
            key_words: thesis.key_words,
            category: {
                connect: {
                    id: thesis.category_id
                }
            },
            thesisFiles: {
                create: [
                    {
                        thesis_url: thesis.thesis_url
                    }
                ]
            },
            user: {
                connect: {
                    id: thesis.user_id
                }
            }
        },
        include: {
            thesisFiles: {
                include: true
            }
        }
    });

    return thesis_result;
}