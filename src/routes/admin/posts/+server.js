import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

// GET - Načítání příspěvků (včetně aktivace)
export async function GET({ url }) {
  const table = url.searchParams.get('table');
  let data;

  if (!table || table !== 'posts') {
    return new Response(JSON.stringify({ error: 'Tabulka musí být "posts"' }), { status: 400 });
  }

  try {
    data = await db.select().from(posts);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Chyba při načítání příspěvků:', error);
    return new Response(JSON.stringify({ error: 'Došlo k chybě při načítání příspěvků.' }), { status: 500 });
  }
}

// PUT - Aktualizace příspěvku (včetně aktivace/deaktivace)
export async function PUT({ params, request }) {
  const { id } = params;
  const updatedData = await request.json();

  try {
    const post = await db.select().from(posts).where(eq(posts.id, id)).get();
    
    if (!post) {
      return new Response(JSON.stringify({ success: false, message: 'Post not found' }), { status: 404 });
    }

    // Kontrola, jestli je příspěvek aktivní
    const isActive = updatedData.active ?? post.active;  // Změna na 'active'

    await db.update(posts).set({ ...updatedData, active: isActive }).where(eq(posts.id, id)).run();

    return new Response(JSON.stringify({ success: true, message: 'Post updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Chyba při aktualizaci příspěvku:', error);
    return new Response(JSON.stringify({ success: false, message: 'Failed to update post' }), { status: 500 });
  }
}


// DELETE - Smazání příspěvku
export async function DELETE({ params }) {
  const { id } = params;

  try {
    const post = await db.select().from(posts).where(eq(posts.id, id)).get();
    
    if (!post) {
      return new Response(JSON.stringify({ success: false, message: 'Post not found' }), { status: 404 });
    }

    await db.delete(posts).where(eq(posts.id, id)).run();
    return new Response(JSON.stringify({ success: true, message: 'Post deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Chyba při mazání příspěvku:', error);
    return new Response(JSON.stringify({ success: false, message: 'Failed to delete post' }), { status: 500 });
  }
}
