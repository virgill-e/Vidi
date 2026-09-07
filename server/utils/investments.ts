import { eq } from 'drizzle-orm';
import { investments } from '../database/schema';
import { db, fetchAll } from './db';

const QTY_EPSILON = 1e-9;

// Total quantity currently held of an asset (buys minus sells), matching how
// the rest of the app aggregates holdings. Asset names are compared
// case-insensitively since the rest of the UI does the same.
export const getHeldQuantity = async (userId: number, asset: string, excludeId?: number): Promise<number> => {
    const rows = await fetchAll(
        db.select()
            .from(investments as any)
            .where(eq((investments as any).userId, userId))
    );

    const target = asset.toLowerCase();
    return rows
        .filter((r: any) => r.asset.toLowerCase() === target && (excludeId === undefined || r.id !== excludeId))
        .reduce((acc: number, r: any) => {
            if (r.type === 'buy') return acc + r.quantity;
            if (r.type === 'sell') return acc - r.quantity;
            return acc;
        }, 0);
};

// Throws a 400 if applying `type`/`quantity` to `asset` would push the held
// quantity below zero. `heldBefore` is the holding excluding the transaction
// being created/edited (see getHeldQuantity's excludeId).
export const assertHoldingNotNegative = (asset: string, type: string, quantity: number, heldBefore: number) => {
    const resultingQty = heldBefore + (type === 'buy' ? quantity : type === 'sell' ? -quantity : 0);
    if (resultingQty < -QTY_EPSILON) {
        throw createError({
            statusCode: 400,
            statusMessage: `Quantité insuffisante : cette opération ferait passer la quantité détenue de ${asset} en dessous de zéro (${resultingQty}).`,
        });
    }
};
