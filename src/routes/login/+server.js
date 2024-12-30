import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import bcrypt from 'bcryptjs';
import { serialize, parse } from 'cookie'; // Import pro práci s cookies
import { eq } from 'drizzle-orm';

export async function POST({ request }) {
  const cookies = parse(request.headers.get('cookie') || '');

  // Zkontroluj, jestli už je uživatel přihlášený
  if (cookies.session) {
    return new Response(JSON.stringify({ success: false, message: 'Already logged in' }), { status: 400 });
  }

  const formData = await request.formData();
  const nickname = formData.get('nickname');
  const password = formData.get('password');
  const rememberMe = formData.get('rememberMe') === 'true'; // Získání hodnoty pro "Zapamatovat si mě"

  if (!nickname || !password) {
    return new Response(JSON.stringify({ success: false, message: 'Invalid input' }), { status: 400 });
  }

  try {
    const user1 = await db.select().from(user).where(eq(user.nickname, nickname)).get();

    if (!user1) {
      return new Response(JSON.stringify({ success: false, message: 'User not found' }), { status: 404 });
    }

    const valid = await bcrypt.compare(password, user1.password_hash);

    if (!valid) {
      return new Response(JSON.stringify({ success: false, message: 'Invalid password' }), { status: 401 });
    }

    if (user1.is_email_verified !== 1) {
      return new Response(JSON.stringify({ success: false, message: 'Please verify your email before logging in.' }), { status: 403 });
    }

    // Označujeme uživatele jako online
    await db.update(user)
      .set({ is_online: 1 })
      .where(eq(user.id, user1.id))
      .run();

    // Nastavení cookie na základě "Remember Me"
    const cookieOptions = rememberMe
      ? {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 365, // 365 dní pro "Remember Me"
          sameSite: 'strict', // Nastavíme správný typ
          secure: true,
          path: '/'
        }
      : {
          httpOnly: true,
          sameSite: 'strict', // Session cookie bez maxAge
          secure: true,
          path: '/'
        };

    const cookie = serialize('session', user1.id.toString(), cookieOptions); // Nastavíme cookie

    return new Response(JSON.stringify({ success: true, message: 'Login successful' }), {
      status: 200,
      headers: {
        'Set-Cookie': cookie
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ success: false, message: 'Internal Server Error' }), { status: 500 });
  }
}
