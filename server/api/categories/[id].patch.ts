import { eq, and } from 'drizzle-orm';
import { categories } from '../../database/schema';

export default defineEventHandler(async (event) => {
    const session = await requireUserSession(event);
    const user = session.user as { id: number };
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);

    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Category ID is required',
        });
    }

    const { name, color, icon } = body;

    const updated = await db.update(categories)
        .set({
            name,
            color,
            icon,
        })
        .where(
            and(
                eq(categories.id, Number(id)),
                eq(categories.userId, user.id)
            )
        )
        .returning()
        .get();

    if (!updated) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Category not found or unauthorized',
        });
    }

    return updated;
});
