<script context="module" lang="ts">
  export { load } from './+server.js';  // Načítání dat z +server.js
</script>

<script lang="ts">
  export let data: { posts: Array<any> };  // Data s příspěvky
</script>

<h1>Příspěvky</h1>

{#if data?.posts?.length > 0} <!-- Zkontrolujeme, zda `data` a `posts` nejsou undefined -->
  <ul>
    {#each data.posts as post}
      <li>
        <h2>{post.title}</h2>
        <p>{post.description.slice(0, 100)}...</p>
        <p>Autor: {post.nickname}</p>
        <p>Štítek: {post.subject_banner}</p>
        <img src={post.freeware_banner} alt="Freeware banner" />
      </li>
    {/each}
  </ul>
{:else}
  <p>Žádné příspěvky nejsou k dispozici.</p>
{/if}
