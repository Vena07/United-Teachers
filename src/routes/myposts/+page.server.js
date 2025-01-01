import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';  // Import schématu pro příspěvky
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export async function load({ locals }) {
    console.log("Checking user data...");

    // Zajistíme, že uživatel je přihlášen
    if (!locals.user1) {
        throw error(404, {
            message: 'User not found',
        });
    }

    // Filtrování příspěvků podle ID přihlášeného uživatele
    const userPosts = await db.select().from(posts).where(eq(posts.author_id, locals.user1.id)).all();

    console.log('Loaded posts:', userPosts);  // Debugging: Kontrola, jaké příspěvky jsou načteny

    // Pokud nejsou žádné příspěvky pro přihlášeného uživatele, vrátíme prázdný seznam
    if (userPosts.length === 0) {
        return {
            props: {
                posts: [],  // Vracíme prázdný seznam příspěvků
            }
        };
    }

    // Pokud existují příspěvky, vrátíme je
    return {
        props: {
            posts: userPosts,  // Vracíme příspěvky pro přihlášeného uživatele
        }
    };
}
