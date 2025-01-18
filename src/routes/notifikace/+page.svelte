<script>
    import { onMount } from 'svelte';

    let notifications = [];  // Pro uložení všech notifikací
    let filteredNotifications = [];  // Pro uložení filtrovaných notifikací
    let userId = 1;  // Toto získáme z cookies nebo session na serveru

    // Načteme všechna data (notifikace) při načtení stránky
    onMount(async () => {
        try {
            // Zavoláme API pro načtení všech notifikací
            const response = await fetch('/api/data?table=notifications');
            const data = await response.json();

            // Pokud data nejsou prázdná, uložíme je do notifications
            if (data && !data.error) {
                notifications = data;

                // Filtrování notifikací podle přihlášeného uživatele
                filteredNotifications = notifications.filter(notification => notification.user_id === userId);
            } else {
                console.log('Chyba při načítání notifikací:', data.error);
            }
        } catch (error) {
            console.log('Došlo k chybě při načítání notifikací:', error);
        }
    });
</script>

<h1>Notifikace pro uživatele</h1>

{#if filteredNotifications.length > 0}
    <ul>
        {#each filteredNotifications as notification}
            <li>
                <strong>Popis:</strong> {notification.description}<br />
                <strong>Vytvořeno:</strong> {new Date(notification.created_at).toLocaleString()}
            </li>
        {/each}
    </ul>
{:else}
    <p>Žádné notifikace k dispozici.</p>
{/if}
