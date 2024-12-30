import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { parse } from 'cookie';

export async function POST({ request }) {
    try {
        const data = await request.json();

        const {
            title,
            subjectBanner,
            freewareBanner,
            photoUrl,
            description,
            installationLinks,
            didacticLinks,
        } = data;

        // Validace povinných polí
        if (!title || !subjectBanner || !freewareBanner || !description || !installationLinks) {
            return new Response(
                JSON.stringify({ success: false, message: 'All required fields must be filled.' }),
                { status: 400 }
            );
        }

        // Získej aktuálního přihlášeného uživatele
        const cookies = parse(request.headers.get('cookie') || '');
        const userId = cookies.session; // Předpokládáme, že ID uživatele je uložené v cookie "session"

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

        // Uložení dat do databáze
        await db.insert(posts).values({
            title,
            subject_banner: subjectBanner,
            freeware_banner: freewareBanner,
            published_at: new Date(),
            photo_url: photoUrl || null,
            author_id: currentUser.id,
            description,
            installation_links: installationLinks,
            didactic_links: didacticLinks || null,
        }).run();

        // Přesměrování po úspěchu
        return new Response(
            JSON.stringify({ success: true, message: 'Post successfully created.' }),
            {
                status: 201,
                headers: {
                    Location: '/posts', // Změňte na správnou URL
                },
            }
        );
    } catch (error) {
        console.error('Error creating post:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Failed to create post.' }),
            { status: 500 }
        );
    }
}
