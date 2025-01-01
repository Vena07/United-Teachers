import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { parse } from 'cookie';

export async function PUT({ request }) {
    try {
        const data = await request.json();

        const {
            postId,  // Přidání ID příspěvku pro identifikaci, který příspěvek se má upravit
            title,
            subjectBanner,
            freewareBanner,
            photoUrl,
            description,
            installationLinks,
            didacticLinks,
        } = data;

        // Validace povinných polí
        if (!postId || !title || !subjectBanner || !freewareBanner || !description || !installationLinks) {
            return new Response(
                JSON.stringify({ success: false, message: 'All required fields must be filled.' }),
                { status: 400 }
            );
        }

        // Získej aktuálního přihlášeného uživatele
        const cookies = parse(request.headers.get('cookie') || '');
        const userId = cookies.session;  // Předpokládáme, že ID uživatele je uložené v cookie "session"

        if (!userId) {
            return new Response(
                JSON.stringify({ success: false, message: 'User is not logged in.' }),
                { status: 401 }
            );
        }

        // Ověř uživatele v databázi
        const currentUser = await db.select().from(user).where(eq(user.id, parseInt(userId))).get();

        if (!currentUser) {
            return new Response(
                JSON.stringify({ success: false, message: 'User does not exist.' }),
                { status: 404 }
            );
        }

        // Aktualizace příspěvku v databázi
        await db.update(posts).set({
            title,
            subject_banner: subjectBanner,
            freeware_banner: freewareBanner,
            photo_url: photoUrl || null,
            description,
            installation_links: installationLinks,
            didactic_links: didacticLinks || null,
        }).where(eq(posts.id, postId)).run();

        // Odpověď po úspěchu
        return new Response(
            JSON.stringify({ success: true, message: 'Post successfully updated.' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating post:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Failed to update post.' }),
            { status: 500 }
        );
    }
}
