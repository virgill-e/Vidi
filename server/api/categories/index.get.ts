import { eq } from 'drizzle-orm';
import { categories } from '../../database/schema';

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event);
    if (!session.user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        });
    }

    const user = session.user as { id: number };
    const userCategories = await db.select().from(categories).where(eq(categories.userId, user.id)).all();

    return userCategories;
});
