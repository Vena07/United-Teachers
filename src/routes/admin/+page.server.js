import { error } from '@sveltejs/kit';

export async function load({ locals }) {
    // Zkontrolujeme, zda uživatel je přihlášen a zda je admin
    if (!locals.user1 || locals.user1.admin !== 1) {
        throw error(403, 'Access denied: You must be an admin');
    }

    return {
        props: {
            user: locals.user1
        }
    };
}
