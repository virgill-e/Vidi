import { eq, desc } from 'drizzle-orm';
import { expenses, categories } from '../../database/schema';

export default defineEventHandler(async (event) => {
    const session = await getUserSession(event);
    if (!session.user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        });
    }

    const user = session.user as { id: number };
    const userExpenses = await db.select({
        id: expenses.id,
        amount: expenses.amount,
        merchant: expenses.merchant,
        date: expenses.date,
        note: expenses.note,
        category: {
            id: categories.id,
            name: categories.name,
            icon: categories.icon,
            color: categories.color
        }
    })
        .from(expenses)
        .innerJoin(categories, eq(expenses.categoryId, categories.id))
        .where(eq(expenses.userId, user.id))
        .orderBy(desc(expenses.date))
        .all();

    return userExpenses;
});
