<script>
    let postss = $state([]);  // Příspěvky
    let selectedPost = $state(null);  // Vybraný příspěvek
    let currentPage = $state(1);  // Aktuální stránka (1. stránka na začátku)
    const postsPerPage = 3;  // Počet příspěvků na stránku
    let users = $state([]);  // Uživatelé (pro získání nickname)
    let ratingss = $state([]);  // Hodnocení (pokud je potřeba)

    // Funkce pro načítání dat z API
    const loadData = async (table) => {
        try {
            const response = await fetch(`/api/data?table=${table}`);
            if (response.ok) {
                return await response.json();
            } else {
                console.error(`Chyba při načítání ${table}:`, await response.text());
                return [];
            }
        } catch (error) {
            console.error(`Chyba při načítání ${table}:`, error);
            return [];
        }
    };

    // Načítání dat pomocí $effect
    $effect(() => {
        loadData('posts').then((data) => {
            postss = data; // Uložíme všechny příspěvky do stavu
        });
        loadData('user').then((data) => (users = data));
        loadData('ratings').then((data) => (ratingss = data));
    });

    // Funkce pro zobrazení detailu příspěvku
    function showPostDetail(post) {
        selectedPost = post;  // Nastavíme detail vybraného příspěvku
    }

    // Funkce pro skrytí detailu a návrat k seznamu příspěvků
    function hidePostDetail() {
        selectedPost = null;  // Skryjeme detailní zobrazení
    }

    // Funkce pro přepnutí na předchozí stránku
    function goToPreviousPage() {
        if (currentPage > 1) {
            currentPage -= 1;
        }
    }

    // Funkce pro přepnutí na další stránku
    function goToNextPage() {
        if (currentPage * postsPerPage < postss.length) {
            currentPage += 1;
        }
    }

    // Funkce pro výběr příspěvků pro aktuální stránku
    function getCurrentPosts() {
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        return postss.slice(startIndex, endIndex);
    }
</script>

<h1>Příspěvky</h1>

{#if selectedPost}
    <!-- Zobrazit detail příspěvku -->
    <div>
        <button on:click={hidePostDetail}>Zpět na seznam</button>
        <h2>{selectedPost.title}</h2>
        <p><strong>Autor:</strong> {selectedPost.nickname}</p>
        <p><strong>Datum zveřejnění:</strong> {new Date(selectedPost.published_at).toLocaleDateString()}</p>

        <p><strong>Freeware banner:</strong></p>
        {#if selectedPost.freeware_banner}
            <img src="{selectedPost.freeware_banner}" alt="Freeware banner" />
        {:else}
            <p>Není přidán</p>
        {/if}

        <p><strong>Popis:</strong></p>
        <p>{selectedPost.description}</p>

        {#if selectedPost.photo_url}
            <img src="{selectedPost.photo_url}" alt="Obrázek příspěvku" />
        {:else}
            <p>Obrázek není přidán</p>
        {/if}
    </div>
{:else}
    <!-- Seznam příspěvků pro aktuální stránku -->
    {#each getCurrentPosts() as post}
        <div>
            <h2>{post.title}</h2>
            <p><strong>Autor:</strong> {post.nickname}</p>
            <p><strong>Datum zveřejnění:</strong> {new Date(post.published_at).toLocaleDateString()}</p>
            
            <p><strong>Freeware banner:</strong></p>
            {#if post.freeware_banner}
                <img src="{post.freeware_banner}" alt="Freeware banner" />
            {:else}
                <p>Není přidán</p>
            {/if}

            <p><strong>Popis:</strong> {post.description.length > 200 ? post.description.slice(0, 200) + '...' : post.description}</p>

            <button on:click={() => showPostDetail(post)}>Zobrazit celý příspěvek</button>
        </div>
    {/each}

    <!-- Tlačítka pro stránkování -->
    <div>
        <button on:click={goToPreviousPage} disabled={currentPage === 1}>Předchozí</button>
        <button on:click={goToNextPage} disabled={currentPage * postsPerPage >= postss.length}>Další</button>
    </div>
{/if}
