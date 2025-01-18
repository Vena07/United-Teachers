import { db } from '$lib/server/db';
import { reports, posts, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        const data = await db
            .select({
                report_id: reports.id,
                reason: reports.reason,
                reported_at: reports.reported_at,
                post_id: reports.post_id,
                post_title: posts.title,
                reporter_id: reports.reporter_id,
            })
            .from(reports)
            .leftJoin(posts, eq(reports.post_id, posts.id));

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Chyba při načítání reportů:', error);
        return new Response(JSON.stringify({ error: 'Chyba při načítání reportů.' }), { status: 500 });
    }
}

import { db } from '$lib/server/db';
import { reports, posts, user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
    try {
        const data = await db
            .select({
                report_id: reports.id,
                reason: reports.reason,
                reported_at: reports.reported_at,
                post_id: reports.post_id,
                post_title: posts.title,
                reporter_id: reports.reporter_id,
            })
            .from(reports)
            .leftJoin(posts, eq(reports.post_id, posts.id));

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error('Chyba při načítání reportů:', error);
        return new Response(JSON.stringify({ error: 'Chyba při načítání reportů.' }), { status: 500 });
    }
}

export async function POST({ request }) {
    const { action, reportId, postId } = await request.json();

    if (!action || !reportId || (action === 'accept' && !postId)) {
        return new Response(JSON.stringify({ error: 'Neplatné parametry.' }), { status: 400 });
    }

    try {
        // Načtení příspěvku, pokud je potřeba pro akci 'accept'
        const post = action === 'accept' ? await db.select().from(posts).where(eq(posts.id, postId)).limit(1) : null;
        
        if (action === 'accept' && !post.length) {
            return new Response(JSON.stringify({ error: 'Příspěvek neexistuje.' }), { status: 404 });
        }

        const postOwner = action === 'accept' ? await db.select().from(user).where(eq(user.id, post[0].author_id)).limit(1) : null;

        if (action === 'accept' && !postOwner.length) {
            return new Response(JSON.stringify({ error: 'Autor příspěvku neexistuje.' }), { status: 404 });
        }

        if (action === 'accept') {
            // Deaktivace příspěvku
            await db.update(posts).set({ active: 0 }).where(eq(posts.id, postId));

            // Přidání 1 bodu do report_points uživateli, který je autorem příspěvku
            const userToUpdate = postOwner[0]; // Uložení vlastníka příspěvku do proměnné
            await db.update(user).set({
                report_points: userToUpdate.report_points + 1 // Přičteme 1 bod k existujícím bodům
            }).where(eq(user.id, userToUpdate.id)); // Aktualizujeme příslušného uživatele

            // Smazání reportu po přijetí
            await db.delete(reports).where(eq(reports.id, reportId));
        }

        if (action === 'delete') {
            // Pouze smazání reportu
            await db.delete(reports).where(eq(reports.id, reportId));
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Chyba při zpracování reportu:', error);
        return new Response(JSON.stringify({ error: 'Chyba při zpracování reportu.' }), { status: 500 });
    }
}
