import prisma from "../../lib/prisma/prisma.js";

export async function create_service(user) {
    const created_user = await prisma.users.create({
        data: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            school: {
                connect: {
                    id: "cm2mh8too0001taj4b58ul6qo"
                }
            },
            credential: {
                create: {
                    credential: user.password
                }
            }
        }
    });

    return created_user;
}