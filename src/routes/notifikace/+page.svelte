<script>
    let notifications = [];
    let currentPage = 1; // Aktuální stránka
    const notificationsPerPage = 10; // Počet notifikací na stránku

    async function loadNotifications() {
        const response = await fetch('/api/data?table=notifications');
        if (response.ok) {
            notifications = await response.json();
        } else {
            console.error('Chyba při načítání notifikací:', await response.text());
        }
    }

    // Funkce pro zobrazení notifikací na aktuální stránce
    function getCurrentNotifications() {
        const startIndex = (currentPage - 1) * notificationsPerPage;
        const endIndex = startIndex + notificationsPerPage;
        return notifications.slice(startIndex, endIndex);
    }

    // Přepnutí na předchozí stránku
    function goToPreviousPage() {
        if (currentPage > 1) {
            currentPage -= 1;
        }
    }

    // Přepnutí na další stránku
    function goToNextPage() {
        if (currentPage * notificationsPerPage < notifications.length) {
            currentPage += 1;
        }
    }

    $: loadNotifications(); // Načítání při načtení stránky
</script>

<h1>Notifikace</h1>

{#if notifications.length > 0}
    <ul>
        {#each getCurrentNotifications() as notification}
            <li>
                <strong>Popis:</strong> {notification.description}<br />
                <strong>Vytvořeno:</strong> {new Date(notification.created_at).toLocaleString()}
            </li>
        {/each}
    </ul>

    <!-- Tlačítka pro stránkování -->
    <div>
        <button on:click={goToPreviousPage} disabled={currentPage === 1}>Předchozí</button>
        <button on:click={goToNextPage} disabled={currentPage * notificationsPerPage >= notifications.length}>Další</button>
    </div>
{:else}
    <p>Žádné notifikace nejsou k dispozici.</p>
{/if}
