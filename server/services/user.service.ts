import { prisma } from "../prisma/client";
import { hashPassword } from "../utils/helpers";

export const userService = {
    async findByEmail(email: string) {
        return prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    },

    async findById(id: string) {
        return prisma.user.findUnique({ where: { id } });
    },

    async createWithEmail(data: { name: string; email: string; password: string }) {
        const passwordHash = await hashPassword(data.password);
        return prisma.user.create({
            data: {
                name: data.name,
                email: data.email.toLowerCase(),
                passwordHash,
            },
        });
    },

    async createOrUpdateWithGoogle(profile: any) {
        const email = profile.emails?.[0]?.value;
        if (!email) throw new Error("No email from Google");

        let user = await this.findByEmail(email);

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name: profile.displayName || email.split("@")[0],
                    avatar: profile.photos?.[0]?.value || null,
                    googleId: profile.id,
                },
            });
        } else {
            const updateData: any = {};
            if (!user.googleId) updateData.googleId = profile.id;
            if (profile.photos?.[0]?.value && !user.avatar) {
                updateData.avatar = profile.photos[0].value;
            }
            if (Object.keys(updateData).length > 0) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: updateData,
                });
            }
        }

        return user;
    },
};