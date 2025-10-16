import prisma from "../../lib/prisma/prisma.js";

export async function get_by_id_service(thesis_id) {
    const thesis = await prisma.thesis.findUnique({
        where: {
            id: thesis_id
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

    return thesis;
}