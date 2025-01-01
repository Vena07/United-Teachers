<script>
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';

  // Reaktivní store pro userId
  let userId = writable(null);  // Tento store představuje uživatelské ID, které musíš získat (např. z cookie, serveru nebo session)

  // Reaktivní proměnné
  let postss = writable([]);  // Příspěvky
  let users = writable([]);   // Uživatelé (pro získání nickname)
  let currentPage = writable(1);  // Aktuální stránka
  const postsPerPage = 2;  // Počet příspěvků na stránku
  let selectedPost = writable(null);  // Vybraný příspěvek
  let editingPost = writable(null); // Post pro editaci

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

  // Načítání dat při mountu
  onMount(() => {
    loadData('posts').then((data) => postss.set(data));
    loadData('user').then((data) => users.set(data));

    // Příklad: Nastavení userId na základě přihlášeného uživatele
    userId.set(1);  // Zde bys měl získat skutečné uživatelské ID (např. z cookie nebo session)
  });

  // Filtrování příspěvků podle přihlášeného uživatele
  const filteredPosts = () => {
    let currentUserId;
    userId.subscribe(value => currentUserId = value);  // Získání aktuálního userId z reaktivního store
    return currentUserId ? $postss.filter(post => post.author_id === currentUserId) : $postss;
  };

  // Funkce pro získání nickname autora
  function getAuthorNickname(authorId) {
    let currentUsers;
    users.subscribe(value => currentUsers = value);  // Získání seznamu uživatelů z reaktivního store
    const author = currentUsers.find(user => user.id === authorId);
    return author ? author.nickname : 'Autor není uveden';
  }

  // Funkce pro stránkování
  function getCurrentPosts() {
    let currentPageNumber;
    currentPage.subscribe(value => currentPageNumber = value);  // Získání aktuální stránky z reaktivního store
    const startIndex = (currentPageNumber - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts().slice(startIndex, endIndex);
  }

  // Funkce pro zobrazení detailu příspěvku
  function showPostDetail(post) {
    selectedPost.set(post);
  }

  // Funkce pro skrytí detailu příspěvku
  function hidePostDetail() {
    selectedPost.set(null);
  }

  // Funkce pro přepnutí na předchozí stránku
  function goToPreviousPage() {
    let currentPageNumber;
    currentPage.subscribe(value => currentPageNumber = value);  // Získání aktuální stránky
    if (currentPageNumber > 1) {
      currentPage.set(currentPageNumber - 1);
    }
  }

  // Funkce pro přepnutí na další stránku
  function goToNextPage() {
    let currentPageNumber;
    currentPage.subscribe(value => currentPageNumber = value);  // Získání aktuální stránky
    if (currentPageNumber * postsPerPage < filteredPosts().length) {
      currentPage.set(currentPageNumber + 1);
    }
  }

  // Funkce pro úpravu příspěvku
  function editPost(post) {
    editingPost.set({ ...post });  // Vytvoříme kopii pro úpravu
  }

  // Funkce pro uložení úpravy příspěvku
  async function savePost(event) {
    event.preventDefault();

    const updatedPost = $editingPost;

    // Aktualizace příspěvku na serveru
    const response = await fetch(`/api/posts/${updatedPost.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost),
    });

    if (response.ok) {
      // Aktualizujeme seznam příspěvků
      const updatedData = await response.json();
      let currentPosts;
      postss.subscribe(value => currentPosts = value);  // Získání seznamu příspěvků
      postss.set(currentPosts.map(post => post.id === updatedData.id ? updatedData : post));
      editingPost.set(null); // Zavřeme formulář pro úpravu
    } else {
      console.error('Chyba při úpravě příspěvku');
    }
  }

  // Funkce pro vytvoření nového příspěvku
  async function createPost(event) {
    event.preventDefault();

    const newPost = $editingPost;

    // Vytvoření nového příspěvku na serveru
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost),
    });

    if (response.ok) {
      const newPostData = await response.json();
      let currentPosts;
      postss.subscribe(value => currentPosts = value);  // Získání seznamu příspěvků
      postss.set([newPostData, ...currentPosts]); // Přidáme nový příspěvek na začátek seznamu
      editingPost.set(null); // Zavřeme formulář pro vytvoření příspěvku
    } else {
      console.error('Chyba při vytváření příspěvku');
    }
  }

  // Funkce pro smazání příspěvku
  async function deletePost(postId) {
    const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    if (response.ok) {
      let currentPosts;
      postss.subscribe(value => currentPosts = value);  // Získání seznamu příspěvků
      postss.set(currentPosts.filter(post => post.id !== postId)); // Odstraní příspěvek z UI
    } else {
      console.error('Chyba při mazání příspěvku');
    }
  }
</script>

<h1>Příspěvky</h1>

{#if $selectedPost}
    <!-- Zobrazit detail příspěvku -->
    <div>
        <button on:click={hidePostDetail}>Zpět na seznam</button>
        <h2>{$selectedPost.title}</h2>
        <p><strong>Autor:</strong> {getAuthorNickname($selectedPost.author_id)}</p>
        <p><strong>Datum zveřejnění:</strong> {new Date($selectedPost.published_at).toLocaleDateString()}</p>

        <p><strong>Freeware banner:</strong> {$selectedPost.freeware_banner ? $selectedPost.freeware_banner : "Není přidán"}</p>

        <p><strong>Popis:</strong></p>
        <p>{$selectedPost.description}</p>

        {#if $selectedPost.photo_url}
            <img src="{$selectedPost.photo_url}" alt="Obrázek příspěvku" />
        {:else}
            <p>Obrázek není přidán</p>
        {/if}

        <p><strong>Odkazy na instalaci:</strong></p>
        {#if $selectedPost.installation_links}
            <a href={$selectedPost.installation_links} target="_blank">Klikněte pro zobrazení odkazu na instalaci</a>
        {:else}
            <p>Odkazy nejsou přidány</p>
        {/if}

        <p><strong>Didaktické odkazy:</strong></p>
        {#if $selectedPost.didactic_links}
            <a href={$selectedPost.didactic_links} target="_blank">Klikněte pro zobrazení didaktických odkazů</a>
        {:else}
            <p>Didaktické odkazy nejsou přidány</p>
        {/if}
    </div>
{:else if $editingPost}
    <!-- Formulář pro úpravu příspěvku -->
    <div>
        <h2>{$editingPost.id ? 'Upravit příspěvek' : 'Vytvořit nový příspěvek'}</h2>
        <form on:submit={$editingPost.id ? savePost : createPost}>
            <label>
                Název
                <input type="text" bind:value={$editingPost.title} required />
            </label>
            <label>
                Popis
                <textarea bind:value={$editingPost.description}></textarea>
            </label>
            <label>
                Foto URL
                <input type="text" bind:value={$editingPost.photo_url} />
            </label>
            <label>
                Odkazy na instalaci
                <input type="text" bind:value={$editingPost.installation_links} />
            </label>
            <label>
                Didaktické odkazy
                <input type="text" bind:value={$editingPost.didactic_links} />
            </label>
            <button type="submit">Uložit</button>
        </form>
    </div>
{:else}
    <!-- Seznam příspěvků -->
    <ul>
        {#each getCurrentPosts() as post}
            <li>
                <h3>{post.title}</h3>
                <p>Vytvořen dne:    { new Date(post.published_at).toLocaleDateString()}</p>
                <button on:click={() => showPostDetail(post)}>Detail</button>
                <button on:click={() => editPost(post)}>Upravit</button>
                <button on:click={() => deletePost(post.id)}>Smazat</button>
            </li>
        {/each}
    </ul>

    <!-- Stránkování -->
    <div>
        <button on:click={goToPreviousPage} disabled={$currentPage === 1}>Předchozí</button>
        <span>Stránka {$currentPage}</span>
        <button on:click={goToNextPage} disabled={$currentPage * postsPerPage >= filteredPosts().length}>Další</button>
    </div>
{/if}
