import { hash } from 'bcrypt';
import { eq } from 'drizzle-orm';
import { users } from '../../database/schema';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, password, name } = body;

    if (!email || !password || !name) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email, password and name are required',
        });
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).get();
    if (existingUser) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Email already in use',
        });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const newUser = await db.insert(users).values({
        email,
        name,
        password: hashedPassword,
    }).returning().get();

    // Create session
    await setUserSession(event, {
        user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
        },
    });

    return {
        user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
        },
    };
});
