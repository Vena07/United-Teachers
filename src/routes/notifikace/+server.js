import { db } from '$lib/server/db';
import { notifications } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function load({ locals }) {
    const user = locals.user1;  // Načteme uživatele z locals

    if (!user) {
        throw error(401, 'Not authorized');  // Pokud není uživatel přihlášený, hodíme chybu
    }

    const userId = user.id;
    console.log(`Načítám notifikace pro uživatele s ID: ${userId}`);

    const userNotifications = await db
        .select()
        .from(notifications)
        .where(eq(notifications.user_id, userId))
        .all();

    console.log("Notifikace pro uživatele:", userNotifications);  // Logování načtených notifikací

    return {
        notifications: userNotifications  // Poslání dat na stránku
    };
}
