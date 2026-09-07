import { db, fetchOne } from '../../utils/db';
import { investments } from '../../database/schema';
import { eq, and } from 'drizzle-orm';
import { assertHoldingNotNegative, getHeldQuantity } from '../../utils/investments';

export default defineEventHandler(async (event) => {
    const user = await requireAuth(event);

    const userId = user.id;
    const id = getRouterParam(event, 'id');

    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'ID is required' });
    }
    const numericId = parseInt(id);

    const { type, asset, amount, quantity, date, note } = await validateBody(event, investmentUpdateSchema);

    const existing = await fetchOne(
        db.select().from(investments as any)
            .where(and(eq((investments as any).id, numericId), eq((investments as any).userId, userId)))
    );
    if (!existing) {
        throw createError({ statusCode: 404, statusMessage: 'Investment not found' });
    }

    const resultingType = type ?? (existing as any).type;
    const resultingAsset = asset ?? (existing as any).asset;
    const resultingQuantity = quantity ?? (existing as any).quantity;

    if (resultingType !== 'dividend') {
        const held = await getHeldQuantity(userId, resultingAsset, numericId);
        assertHoldingNotNegative(resultingAsset, resultingType, resultingQuantity, held);
    }

    const updateData: any = {};
    if (type !== undefined) updateData.type = type;
    if (asset !== undefined) updateData.asset = asset;
    if (amount !== undefined) updateData.amount = amount;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (date !== undefined) updateData.date = new Date(date);
    if (note !== undefined) updateData.note = note || null;

    const updated = await fetchOne(
        db.update(investments as any)
            .set(updateData)
            .where(and(
                eq((investments as any).id, parseInt(id)),
                eq((investments as any).userId, userId)
            ))
            .returning()
    );

    if (!updated) {
        throw createError({ statusCode: 404, statusMessage: 'Investment not found' });
    }

    return updated;
});
