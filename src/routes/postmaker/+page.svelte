<script>
    import { goto } from '$app/navigation';

    let title = '';
    let subjectBanner = '';
    let freewareBanner = '';
    let photoUrl = '';
    let description = '';
    let installationLinks = '';
    let didacticLinks = '';
    let notification = '';

    async function createPost(event) {
        event.preventDefault();
        notification = '';

        // Validace povinných polí
        if (!title || !subjectBanner || !freewareBanner || !description || !installationLinks) {
            notification = 'Please fill in all required fields.';
            return;
        }

        try {
            const response = await fetch('/postmaker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    subjectBanner,
                    freewareBanner,
                    photoUrl,
                    description,
                    installationLinks,
                    didacticLinks,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Přesměrování na /posts
                goto('/posts');
            } else {
                notification = result.message || 'Failed to create post.';
            }
        } catch (error) {
            console.error('Error creating post:', error);
            notification = 'An unexpected error occurred. Please try again later.';
        }
    }
</script>

<form on:submit={createPost}>
    <h1>Create Post</h1>

    <label>
        Title (Required)
        <input type="text" bind:value={title} required />
    </label>

    <label>
        Subject Banner (Required)
        <input type="text" bind:value={subjectBanner} required />
    </label>

    <label>
        Freeware Banner (Required)
        <input type="text" bind:value={freewareBanner} required />
    </label>

    <label>
        Description (Required)
        <textarea bind:value={description} required></textarea>
    </label>

    <label>
        Installation Links (Required)
        <textarea bind:value={installationLinks} required></textarea>
    </label>

    <label>
        Didactic Links (Optional)
        <textarea bind:value={didacticLinks}></textarea>
    </label>

    <label>
        Photo URL (Optional)
        <input type="text" bind:value={photoUrl} />
    </label>

    <button type="submit">Create Post</button>

    {#if notification}
        <div class="notification">{notification}</div>
    {/if}
</form>

<style>
    .notification {
        color: red;
        margin-top: 1rem;
    }
</style>
