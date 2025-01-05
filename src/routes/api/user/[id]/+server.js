import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH({ params, request }) {
    const { id } = params;
    const { admin } = await request.json();  // Získáme novou hodnotu admin (1 nebo 0)

    try {
        // Aktualizujeme admin status uživatele
        const updatedUser = await db
            .update(user)
            .set({ admin })  // Změníme hodnotu admin na 1 nebo 0
            .where(eq(user.id, id))
            .run();

        // Vracíme úspěšnou odpověď
        if (updatedUser) {
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ success: false, message: 'Uživatel nenalezen.' }), { status: 404 });
        }
    } catch (error) {
        console.error('Chyba při změně statusu administrátora:', error);
        return new Response(JSON.stringify({ success: false, message: 'Chyba při změně statusu uživatele.' }), { status: 500 });
    }
}

export async function DELETE({ params }) {
    const { id } = params;

    try {
        // Smažeme uživatele podle ID
        const deletedUser = await db
            .delete(user)
            .where(eq(user.id, id))
            .run();

        // Vracíme úspěšnou odpověď, pokud uživatel byl smazán
        if (deletedUser) {
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ success: false, message: 'Uživatel nenalezen.' }), { status: 404 });
        }
    } catch (error) {
        console.error('Chyba při mazání uživatele:', error);
        return new Response(JSON.stringify({ success: false, message: 'Chyba při mazání uživatele.' }), { status: 500 });
    }
}
