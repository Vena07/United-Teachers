<script>
    let postss = $state([]);  // Příspěvky
    let users = $state([]);   // Uživatelé (pro získání nickname)
    let currentPage = $state(1);  // Aktuální stránka
    const postsPerPage = 2;  // Počet příspěvků na stránku
    let selectedPost = $state(null);  // Vybraný příspěvek

    let isReporting = $state(false);  // Stav pro zobrazení formuláře pro nahlášení
    let reportReason = $state('');    // Důvod nahlášení
    let selectedPostForReport = $state(null);  // Vybraný příspěvek pro nahlášení

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
        loadData('posts').then((data) => postss = data.filter(post => post.active === 1));  // Filtr na aktivní příspěvky
        loadData('user').then((data) => users = data);
    });

    // Funkce pro získání nickname autora na základě author_id
    function getAuthorNickname(authorId) {
        const author = users.find(user => user.id === authorId);
        return author ? author.nickname : 'Autor není uveden';
    }

    // Funkce pro zobrazení detailu příspěvku
    function showPostDetail(post) {
        selectedPost = post;
    }

    // Funkce pro skrytí detailu příspěvku
    function hidePostDetail() {
        selectedPost = null;
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

    // Funkce pro odeslání nahlášení
    async function submitReport() {
        const cookies = document.cookie;
        const userId = cookies.match(/session=([0-9]+)/)?.[1];  // Získání ID uživatele z cookies

        // Validace, zda je vyplněný důvod
        if (!reportReason.trim()) {
            alert('Prosím zadejte důvod nahlášení.');
            return;
        }

        // Odeslání požadavku na server bez validace
        const response = await fetch('/posts', {
            method: 'POST',
            body: JSON.stringify({
                postId: selectedPostForReport.id,
                reason: reportReason,
                reporterId: userId,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (data.success) {
            alert('Příspěvek byl úspěšně nahlášen.');
        } else {
            alert('Došlo k chybě při odesílání nahlášení.');
        }

        cancelReport();
    }

    // Funkce pro zrušení nahlášení
    function cancelReport() {
        isReporting = false;
        reportReason = '';
        selectedPostForReport = null;
    }
</script>

<h1>Příspěvky</h1>

{#if selectedPost}
    <!-- Zobrazit detail příspěvku -->
    <div>
        <button onclick={hidePostDetail}>Zpět na seznam</button>
        <h2>{selectedPost.title}</h2>
        <p><strong>Autor:</strong> {getAuthorNickname(selectedPost.author_id)}</p> <!-- Autor -->
        <p><strong>Datum zveřejnění:</strong> {new Date(selectedPost.published_at).toLocaleDateString()}</p>

        <p><strong>Freeware banner:</strong></p>
        {#if selectedPost.freeware_banner}
            <p>{selectedPost.freeware_banner}</p> <!-- Textová informace o banneru -->
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

        <p><strong>Odkazy na instalaci:</strong></p>
        {#if selectedPost.installation_links}
            <a href="{selectedPost.installation_links}" target="_blank">Klikněte pro zobrazení odkazu na instalaci</a>
        {:else}
            <p>Odkazy nejsou přidány</p>
        {/if}

        <p><strong>Didaktické odkazy:</strong></p>
        {#if selectedPost.didactic_links}
            <a href="{selectedPost.didactic_links}" target="_blank">Klikněte pro zobrazení didaktických odkazů</a>
        {:else}
            <p>Didaktické odkazy nejsou přidány</p>
        {/if}

        <!-- Formulář pro nahlášení -->
        {#if isReporting}
            <div>
                <h3>Nahlásit příspěvek</h3>
                <textarea bind:value={reportReason} placeholder="Důvod nahlášení"></textarea>
                <button onclick={submitReport}>Odeslat nahlášení</button>
                <button onclick={cancelReport}>Zrušit</button>
            </div>
        {/if}

        <!-- Tlačítko pro nahlášení -->
        <button onclick={() => { isReporting = true; selectedPostForReport = selectedPost; }}>Nahlásit příspěvek</button>
    </div>
{:else}
    <!-- Seznam příspěvků pro aktuální stránku -->
    {#each getCurrentPosts() as post}
        <div>
            <h2>{post.title}</h2>
            <p><strong>Autor:</strong> {getAuthorNickname(post.author_id)}</p> <!-- Autor -->
            <p><strong>Datum zveřejnění:</strong> {new Date(post.published_at).toLocaleDateString()}</p>

            <p><strong>Freeware banner:</strong></p>
            {#if post.freeware_banner}
                <p>{post.freeware_banner}</p> <!-- Textová informace o banneru -->
            {:else}
                <p>Není přidán</p>
            {/if}

            <p><strong>Popis:</strong> {post.description.length > 200 ? post.description.slice(0, 200) + '...' : post.description}</p>

            <button onclick={() => showPostDetail(post)}>Zobrazit celý příspěvek</button>
        </div>
    {/each}

    <!-- Tlačítka pro stránkování -->
    <div>
        <button onclick={goToPreviousPage} disabled={currentPage === 1}>Předchozí</button>
        <button onclick={goToNextPage} disabled={currentPage * postsPerPage >= postss.length}>Další</button>
    </div>
{/if}
