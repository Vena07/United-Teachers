import { db } from '$lib/server/db';  // Ujisti se, že máš správně importovaný db
import { posts } from '$lib/server/db/schema';  // A schema pro posts
import { eq } from 'drizzle-orm';

// Získání příspěvku podle ID
export async function GET({ params }) {
  const { id } = params;

  // Načtení příspěvku z DB
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .get(); // Načte jeden příspěvek

  if (!post) {
    return new Response(
      JSON.stringify({ success: false, message: 'Post not found' }),
      { status: 404 }
    );
  }

  return new Response(JSON.stringify(post), { status: 200 });
}

// Aktualizace příspěvku podle ID
export async function PUT({ params, request }) {
  const { id } = params;
  const updatedData = await request.json();  // Předpokládám, že data přicházejí jako JSON

  // Načteme původní příspěvek
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .get();

  if (!post) {
    return new Response(
      JSON.stringify({ success: false, message: 'Post not found' }),
      { status: 404 }
    );
  }

  // Upravíme příspěvek v databázi
  await db
    .update(posts)
    .set(updatedData)
    .where(eq(posts.id, id))
    .run();

  return new Response(
    JSON.stringify({ success: true, message: 'Post updated successfully' }),
    { status: 200 }
  );
}

// Smazání příspěvku podle ID
export async function DELETE({ params }) {
  const { id } = params;

  // Načteme příspěvek
  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .get();

  if (!post) {
    return new Response(
      JSON.stringify({ success: false, message: 'Post not found' }),
      { status: 404 }
    );
  }

  // Smažeme příspěvek z DB
  await db
    .delete(posts)
    .where(eq(posts.id, id))
    .run();

  return new Response(
    JSON.stringify({ success: true, message: 'Post deleted successfully' }),
    { status: 200 }
  );
}
