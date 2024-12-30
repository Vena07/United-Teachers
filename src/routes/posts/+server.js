import drizzleDb, { posts, user } from '$lib/server/db/schema'; // Import DB a modelů
import { json } from '@sveltejs/kit';

export async function load() {
  try {
    // Načítání příspěvků a připojení uživatelských dat
    const postsData = await drizzleDb
      .select(posts)
      .leftJoin(user, posts.author_id.equals(user.id));  // Připojíme uživatele k příspěvkům

    // Vrácení načtených dat ve formátu JSON
    return json(postsData);
  } catch (error) { 
    console.error("Chyba při načítání příspěvků:", error);
    return json({ error: 'Chyba při načítání příspěvků' }, { status: 500 });
  }
}
