import prisma from "../../lib/prisma/prisma.js";

export async function update_service(thesis) {
    const updated_thesis = await prisma.thesis.update({
        where: {
            id: thesis.id
        },
        data: {
            title: thesis?.title,
            abstract: thesis?.abstract,
            key_words: thesis?.key_words,
            ...(thesis?.category_id && { category: { connect: { id: thesis?.category_id } } })
        }
    });

    return updated_thesis;
}