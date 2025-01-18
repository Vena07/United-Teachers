import { parse } from 'cookie';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function handle({ event, resolve }) {
  const cookie = event.request.headers.get('cookie');
  console.log("Received cookie:", cookie);  // Logování přijatých cookies

  if (cookie) {
    const { session } = parse(cookie);
    console.log("Session ID from cookie:", session);  // Logování session ID z cookie

    if (session) {
      // Ověření, že session je platné číslo
      const sessionId = parseInt(session);
      console.log("Parsed session ID:", sessionId);  // Logování čísla session ID

      if (!isNaN(sessionId)) {
        // Načítání uživatele podle session ID
        const user1 = await db.select().from(user).where(eq(user.id, sessionId)).get();
        console.log("User from database:", user1);  // Logování načteného uživatele z DB

        if (user1) {
          event.locals.user1 = user1;
          console.log('User found and set in locals:', user1);  // Logování uživatele v locals
        } else {
          console.log('User not found with ID:', sessionId);  // Logování při nenalezení uživatele
        }
      } else {
        console.log('Session ID is not a valid number');  // Logování, že session ID není platné číslo
      }
    } else {
      console.log('Session not found in cookie');  // Logování, že session není v cookie
    }
  } else {
    console.log('Cookie not found');  // Logování, že cookie nebyla odeslána
  }

  return resolve(event);
}
