<script>
    const {data} = $props(); // Svelte 5 import data
    const user = data.props?.User1; // props - writing select object
    console.log(user);

    async function logout() {
        await fetch('/logout', { method: 'POST' });
        window.location.href = '/login';
    }

    function calculateAge(birthDate) {
        const birth = new Date(birthDate); // Převod data narození na objekt Date
        const today = new Date(); // Dnešní datum
        let age = today.getFullYear() - birth.getFullYear(); // Počítání věku podle let

        // Pokud narozeniny letos ještě neproběhly, odečteme jeden rok
        const monthDifference = today.getMonth() - birth.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    }

    let vek = calculateAge(user.datum_nar);
</script>

<div>
    <button onclick={logout}>Logout</button>
    <img src="{user.profile_image}" alt="">
    <div>
        <p>{user.nickname}<br> {vek} Let</p>
    </div>
    <a href="/postmaker">Vytvořit příspěvek</a>
    <a href="/myposts">Vaše příspěvky</a>
    <a href="/notifikace">Notifikace</a>

    <!-- Zobrazení odkazu na admin stránku pouze pro adminy -->
    {#if user.admin === 1}
        <a href="/admin">Admin</a>
    {/if}
</div>
