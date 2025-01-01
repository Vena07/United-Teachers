<script>
    let postss = $state([]);  // Příspěvky
    let users = $state([]);   // Uživatelé (pro získání nickname)
    let currentPage = $state(1);  // Aktuální stránka
    const postsPerPage = 2;  // Počet příspěvků na stránku
    let selectedPost = $state(null);  // Vybraný příspěvek
    let editingPost = $state(null); // Post pro editaci
  
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
      loadData('posts').then((data) => postss = data);
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
  
    // Funkce pro úpravu příspěvku
    function editPost(post) {
      editingPost = { ...post }; // Vytvoříme kopii pro úpravu
    }
  
    // Funkce pro uložení úpravy příspěvku
    async function savePost(event) {
      event.preventDefault();
  
      const updatedPost = editingPost;
  
      // Aktualizace příspěvku na serveru
      const response = await fetch(`/api/posts/${editingPost.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPost),
      });
  
      if (response.ok) {
        // Aktualizujeme seznam příspěvků
        const updatedData = await response.json();
        postss = postss.map(post => post.id === updatedData.id ? updatedData : post);
        editingPost = null; // Zavřeme formulář pro úpravu
      } else {
        console.error('Chyba při úpravě příspěvku');
      }
    }
  
    // Funkce pro vytvoření nového příspěvku
    async function createPost(event) {
      event.preventDefault();
  
      const newPost = {
        title: editingPost.title,
        subject_banner: editingPost.subject_banner,
        freeware_banner: editingPost.freeware_banner,
        description: editingPost.description,
        installation_links: editingPost.installation_links,
        didactic_links: editingPost.didactic_links,
        photo_url: editingPost.photo_url,
      };
  
      // Vytvoření nového příspěvku na serveru
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
  
      if (response.ok) {
        const newPostData = await response.json();
        postss = [newPostData, ...postss]; // Přidáme nový příspěvek na začátek seznamu
        editingPost = null; // Zavřeme formulář pro vytvoření příspěvku
      } else {
        console.error('Chyba při vytváření příspěvku');
      }
    }
  
    // Funkce pro smazání příspěvku
    async function deletePost(postId) {
      const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (response.ok) {
        postss = postss.filter(post => post.id !== postId); // Odstraní příspěvek z UI
      } else {
        console.error('Chyba při mazání příspěvku');
      }
    }
  </script>
  
  <h1>Příspěvky</h1>
  
  {#if selectedPost}
      <!-- Zobrazit detail příspěvku -->
      <div>
          <button onclick={hidePostDetail}>Zpět na seznam</button>
          <h2>{selectedPost.title}</h2>
          <p><strong>Autor:</strong> {getAuthorNickname(selectedPost.author_id)}</p>
          <p><strong>Datum zveřejnění:</strong> {new Date(selectedPost.published_at).toLocaleDateString()}</p>
  
          <p><strong>Freeware banner:</strong> {selectedPost.freeware_banner ? selectedPost.freeware_banner : "Není přidán"}</p>
  
          <p><strong>Popis:</strong></p>
          <p>{selectedPost.description}</p>
  
          {#if selectedPost.photo_url}
              <img src="{selectedPost.photo_url}" alt="Obrázek příspěvku" />
          {:else}
              <p>Obrázek není přidán</p>
          {/if}
  
          <p><strong>Odkazy na instalaci:</strong></p>
          {#if selectedPost.installation_links}
              <a href={selectedPost.installation_links} target="_blank">Klikněte pro zobrazení odkazu na instalaci</a>
          {:else}
              <p>Odkazy nejsou přidány</p>
          {/if}
  
          <p><strong>Didaktické odkazy:</strong></p>
          {#if selectedPost.didactic_links}
              <a href={selectedPost.didactic_links} target="_blank">Klikněte pro zobrazení didaktických odkazů</a>
          {:else}
              <p>Didaktické odkazy nejsou přidány</p>
          {/if}
      </div>
  {:else if editingPost}
      <!-- Formulář pro úpravu příspěvku -->
      <div>
          <h2>{editingPost.id ? 'Upravit příspěvek' : 'Vytvořit nový příspěvek'}</h2>
          <form onsubmit={editingPost.id ? savePost : createPost}>
              <label>
                  Název
                  <input type="text" bind:value={editingPost.title} required />
              </label>
              <label>
                  Subject Banner
                  <input type="text" bind:value={editingPost.subject_banner} placeholder="Např. Science, Math" />
              </label>
              <label>
                  Freeware Platform
                  <input type="text" bind:value={editingPost.freeware_banner} placeholder="Např. Windows, Mac" />
              </label>
              <label>
                  Odkazy na instalaci
                  <textarea bind:value={editingPost.installation_links} required></textarea>
              </label>
              <label>
                  Didaktické odkazy
                  <textarea bind:value={editingPost.didactic_links}></textarea>
              </label>
              <label>
                  Popis
                  <textarea bind:value={editingPost.description} required></textarea>
              </label>
              <label>
                  Foto URL
                  <input type="text" bind:value={editingPost.photo_url} />
              </label>
              <button type="submit">{editingPost.id ? 'Uložit změny' : 'Vytvořit příspěvek'}</button>
              <button type="button" onclick={() => editingPost = null}>Zrušit</button>
          </form>
      </div>
  {:else}
      <!-- Seznam příspěvků pro aktuální stránku -->
      {#each getCurrentPosts() as post}
          <div>
              <h2>{post.title}</h2>
              <p><strong>Autor:</strong> {getAuthorNickname(post.author_id)}</p>
              <p><strong>Datum zveřejnění:</strong> {new Date(post.published_at).toLocaleDateString()}</p>
  
              <p><strong>Freeware banner:</strong> {post.freeware_banner ? post.freeware_banner : "Není přidán"}</p>
  
              <p><strong>Popis:</strong> {post.description.length > 200 ? post.description.slice(0, 200) + '...' : post.description}</p>
  
              <button onclick={() => showPostDetail(post)}>Zobrazit celý příspěvek</button>
              <button onclick={() => editPost(post)}>Upravit</button>
              <button onclick={() => deletePost(post.id)}>Smazat</button>
          </div>
      {/each}
  
      <!-- Tlačítka pro stránkování -->
      <div>
          <button onclick={goToPreviousPage} disabled={currentPage === 1}>Předchozí</button>
          <button onclick={goToNextPage} disabled={currentPage * postsPerPage >= postss.length}>Další</button>
      </div>
  {/if}
