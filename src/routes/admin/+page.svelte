<script>
    import { goto } from '$app/navigation';
</script>

<h1>Admin Panel</h1>

<nav>
    <ul>
        <li><button on:click={() => goto('/admin/posts')}>Příspěvky</button></li>
        <li><button on:click={() => goto('/admin/users')}>Uživatelé</button></li>
        <li><button on:click={() => goto('/admin/reports')}>Nahlášení</button></li>
    </ul>
</nav>
