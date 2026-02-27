import { compare } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { users } from '../../database/schema';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, password } = body;

    if (!email || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email and password are required',
        });
    }

    // Find user
    const user = await db.select().from(users).where(eq(users.email, email)).get();
    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid credentials',
        });
    }

    // Compare password
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid credentials',
        });
    }

    // Create session
    await setUserSession(event, {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    });

    return {
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
        },
    };
});
