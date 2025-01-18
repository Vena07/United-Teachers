// +page.server.js
import { db } from '$lib/server/db';
import { notifications } from '$lib/server/db/schema';  // Správný import pro notifications
import { eq } from 'drizzle-orm';

export async function load({ locals }) {
    const userId = locals.user1 ? locals.user1.id : null;  // Ujistíme se, že máme uživatelské ID z locals

    if (userId) {
        const notificationsForUser = await db
            .select()
            .from(notifications)
            .where(eq(notifications.user_id, userId));  // Načteme notifikace pro daného uživatele

        console.log('Notifikace pro uživatele:', notificationsForUser);  // Debug log

        return {
            notifications: notificationsForUser
        };
    } else {
        console.log('Uživatel není přihlášen');
        return {
            notifications: []
        };
    }
}
