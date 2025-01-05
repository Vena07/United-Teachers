<script>
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';
  
    let posts = writable([]);
    let editingPost = writable(null);
    let currentPage = writable(1);
    const postsPerPage = 5;
  
    // Načítání dat z API
    const loadData = async () => {
      const response = await fetch(`/api/data?table=posts`);
      if (response.ok) {
        const data = await response.json();
        posts.set(data);
      } else {
        console.error('Chyba při načítání příspěvků');
      }
    };
  
    onMount(() => {
      loadData();
    });
  
    // Funkce pro stránkování
    function getCurrentPosts() {
      const startIndex = ($currentPage - 1) * postsPerPage;
      return $posts.slice(startIndex, startIndex + postsPerPage);
    }
  
    // Funkce pro editaci příspěvku
    function editPost(post) {
      editingPost.set({ ...post });
    }
  
    // Funkce pro uložení změn (editace příspěvku)
    async function savePost() {
      const updatedPost = $editingPost;
      const response = await fetch(`/api/posts/${updatedPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost)
      });
  
      if (response.ok) {
        loadData();  // Načteme data znovu po úspěšné úpravě
        editingPost.set(null);  // Zavřeme formulář
      } else {
        console.error('Chyba při úpravě příspěvku');
      }
    }
  
    // Funkce pro vytvoření nového příspěvku
    async function createPost() {
      const newPost = $editingPost;
      const response = await fetch(`/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      });
  
      if (response.ok) {
        loadData();  // Načteme data znovu po úspěšném vytvoření
        editingPost.set(null);  // Zavřeme formulář
      } else {
        console.error('Chyba při vytváření příspěvku');
      }
    }
  
    // Funkce pro smazání příspěvku
    async function deletePost(postId) {
      const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (response.ok) {
        loadData();  // Načteme data znovu po úspěšném smazání
      } else {
        console.error('Chyba při mazání příspěvku');
      }
    }
  
    // Funkce pro přepnutí mezi stránkami
    function goToNextPage() {
      $currentPage += 1;
    }
  
    function goToPreviousPage() {
      if ($currentPage > 1) {
        $currentPage -= 1;
      }
    }
  
    // Funkce pro aktivaci/deaktivaci příspěvku
    async function toggleActivation(postId) {
      const post = $posts.find(p => p.id === postId);
      const updatedPost = { ...post, active: !post.active };  // Změna na 'active'
  
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost)
      });
  
      if (response.ok) {
        loadData();  // Načteme data znovu po změně aktivace
      } else {
        console.error('Chyba při aktivaci/deaktivaci příspěvku');
      }
    }
  </script>
  
  <h1>Admin - Příspěvky</h1>
  
  {#if $editingPost}
    <!-- Formulář pro úpravu nebo vytvoření příspěvku -->
    <div>
      <h2>{$editingPost.id ? 'Editace příspěvku' : 'Vytvoření nového příspěvku'}</h2>
      <form on:submit|preventDefault={$editingPost.id ? savePost : createPost}>
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
        <label>
          Aktivní
          <input type="checkbox" bind:checked={$editingPost.active} />  <!-- Změněno na 'active' -->
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
          <p>{post.description}</p>
          <p>Aktivní: {post.active ? 'Ano' : 'Ne'}</p>  <!-- Změněno na 'active' -->
          <button on:click={() => editPost(post)}>Editovat</button>
          <button on:click={() => deletePost(post.id)}>Smazat</button>
          <button on:click={() => toggleActivation(post.id)}>
            {post.active ? 'Deaktivovat' : 'Aktivovat'} <!-- Změněno na 'active' -->
          </button>
        </li>
      {/each}
    </ul>
  
    <!-- Stránkování -->
    <div>
      <button on:click={goToPreviousPage} disabled={$currentPage === 1}>Předchozí</button>
      <button on:click={goToNextPage} disabled={getCurrentPosts().length < postsPerPage}>Další</button>
    </div>
  {/if}
  