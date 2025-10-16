import prisma from "../../lib/prisma/prisma.js";

export async function create_thesis_file_service(thesis_id, thesis_url) {
    const created_thesis_file = await prisma.thesisFiles.create({
        data: {
            thesis_url: thesis_url,
            thesis: {
                connect: {
                    id: thesis_id
                }
            }
        }
    });

    return created_thesis_file;
}