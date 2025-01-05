import { db } from '$lib/server/db';
import { user, posts, ratings, notifications } from '$lib/server/db/schema';

const allowedTables = ['user', 'posts', 'ratings', 'notifications']; // Přidáno 'notifications'

export async function GET({ url }) {
    const table = url.searchParams.get('table');
    let data;

    if (!table) {
        return new Response(JSON.stringify({ error: 'Parametr "table" je povinný.' }), { status: 400 });
    }

    try {
        switch (table) {
            case 'user':
                data = await db.select().from(user);
                break;
            case 'posts':
                data = await db.select().from(posts);
                break;
            case 'ratings':
                data = await db.select().from(ratings);
                break;
            case 'notifications': // Přidán case pro 'notifications'
                data = await db.select().from(notifications);
                break;
            case 'reports': // Přidán case pro 'notifications'
                data = await db.select().from(reports);
                break;
            default:
                return new Response(JSON.stringify({ error: `Tabulka "${table}" neexistuje.` }), { status: 400 });
        }

        console.log('API data:', data);
        return new Response(JSON.stringify(data), { status: 200 });

    } catch (error) {
        console.error('Chyba při načítání dat:', error);
        return new Response(JSON.stringify({ error: `Došlo k chybě při načítání tabulky "${table}".` }), { status: 500 });
    }
}
