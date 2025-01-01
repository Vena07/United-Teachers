import { parse } from 'cookie';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function handle({ event, resolve }) {
  const cookie = event.request.headers.get('cookie');
  console.log("Received cookie:", cookie);  // Logování obdrženého cookie

  if (cookie) {
    const { session } = parse(cookie);
    console.log("Session ID from cookie:", session);  // Logování session ID

    if (session) {
      const user1 = await db.select().from(user).where(eq(user.id, parseInt(session))).get();
      console.log("User from database:", user1);  // Logování načteného uživatele z DB

      if (user1) {
        event.locals.user1 = user1;
        console.log('User found:', user1); // Logování při úspěšném nastavení user1
      } else {
        console.log('User not found');
      }
    } else {
      console.log('Session not found in cookie');
    }
  } else {
    console.log('Cookie not found');
  }

  return resolve(event);
}
