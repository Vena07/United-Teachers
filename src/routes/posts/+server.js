import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { reports } from '$lib/server/db/schema';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { parse } from 'cookie';

// PUT pro aktualizaci příspěvku (včetně active)
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
            active,  // Nový parametr pro stav příspěvku (aktivní/neaktivní)
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
            active: active !== undefined ? active : 0,  // Pokud není aktivní parametr, nastavíme default na 0
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

// GET pro načítání příspěvků s filtrem podle active
// GET pro načítání příspěvků s filtrem podle active
export async function GET() {
    try {
        const postsData = await db.select().from(posts).where(posts.active === 1).all();
        console.log('Fetched posts:', postsData); // Log pro kontrolu výsledků
        return new Response(JSON.stringify(postsData), { status: 200 });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return new Response(
            JSON.stringify({ success: false, message: 'Failed to fetch posts.' }),
            { status: 500 }
        );
    }
}

// POST pro nahlášení příspěvku
export async function POST({ request }) {
    try {
        const data = await request.json();

        const { postId, reason } = data;  // Ujistíme se, že máme postId a důvod nahlášení

        // Validace povinných polí
        if (!postId || !reason) {
            return new Response(
                JSON.stringify({ success: false, message: 'Všechny údaje musí být vyplněny.' }),
                { status: 400 }
            );
        }

        // Získej aktuálního přihlášeného uživatele
        const cookies = parse(request.headers.get('cookie') || '');
        const userId = cookies.session;  // ID uživatele uložené v cookie "session"

        if (!userId) {
            return new Response(
                JSON.stringify({ success: false, message: 'Uživatel není přihlášen.' }),
                { status: 401 }
            );
        }

        // Ověření uživatele v databázi
        const currentUser = await db.select().from(user).where(eq(user.id, parseInt(userId))).get();

        if (!currentUser) {
            return new Response(
                JSON.stringify({ success: false, message: 'Uživatel neexistuje.' }),
                { status: 404 }
            );
        }

        // Získání autora příspěvku
        const postData = await db.select().from(posts).where(eq(posts.id, postId)).get();

        if (!postData) {
            return new Response(
                JSON.stringify({ success: false, message: 'Příspěvek nebyl nalezen.' }),
                { status: 404 }
            );
        }

        const postAuthorId = postData.author_id;  // ID autora příspěvku

        // Uložení nahlášení do databáze
        await db.insert(reports).values({
            post_id: postId,
            reporter_id: postAuthorId,  // ID autora příspěvku, ne uživatele, který nahlásil
            reason,  // Důvod nahlášení
        }).run();

        return new Response(
            JSON.stringify({ success: true, message: 'Příspěvek byl úspěšně nahlášen.' }),
            { status: 200 }
        );

    } catch (error) {
        console.error('Chyba při nahlášení příspěvku:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Došlo k chybě při odesílání nahlášení.' }),
            { status: 500 }
        );
    }
}

