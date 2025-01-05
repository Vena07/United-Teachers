<script>
    import { onMount } from 'svelte';
    let users = [];
    let selectedUser = null;

    // Funkce pro načítání uživatelů
    async function loadUsers() {
        const response = await fetch('/api/data?table=user');
        if (response.ok) {
            users = await response.json();
        } else {
            console.error('Chyba při načítání uživatelů:', await response.text());
        }
    }

    // Funkce pro změnu role uživatele
    async function updateRole(userId, isAdmin) {
        const response = await fetch(`/api/user/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ admin: isAdmin ? 1 : 0 })
        });

        const data = await response.json();
        if (data.success) {
            alert('Role uživatele byla změněna.');
            loadUsers();  // Přenačte seznam uživatelů
        } else {
            alert('Došlo k chybě při změně role uživatele.');
        }
    }

    // Funkce pro smazání uživatele
    async function deleteUser(userId) {
        const response = await fetch(`/api/user/${userId}`, { method: 'DELETE' });

        const data = await response.json();
        if (data.success) {
            alert('Uživatel byl smazán.');
            loadUsers();  // Přenačte seznam uživatelů
        } else {
            alert('Došlo k chybě při mazání uživatele.');
        }
    }

    onMount(() => {
        loadUsers();
    });
</script>

<h1>Správa uživatelů</h1>

{#each users as user (user.id)}
    <div>
        <p>{user.nickname} ({user.admin ? 'Admin' : 'Běžný uživatel'})</p>
        <button on:click={() => updateRole(user.id, !user.admin)}>
            {user.admin ? 'Zrušit administrátora' : 'Udělat administrátorem'}
        </button>
        <button on:click={() => deleteUser(user.id)}>Smazat uživatele</button>
    </div>
{/each}
