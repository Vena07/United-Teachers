<script>
    import { goto } from '$app/navigation';

    let title = '';
    let subjectBanner = '';  // Volitelný subject banner
    let freewareBanner = '';  // Volitelný freeware banner (nyní platforma)
    let photoUrl = '';
    let description = '';
    let installationLinks = '';
    let didacticLinks = '';
    let notification = '';

    // Předdefinované možnosti pro subjectBanner
    const subjectBannerOptions = [
        'Science', 'Math', 'History', 'Literature', 'Technology'
    ];

    // Předdefinované možnosti pro freewareBanner (platformy)
    const freewareBannerOptions = [
        'Windows', 'Mac', 'Linux', 'Other'
    ];

    async function createPost(event) {
        event.preventDefault();
        notification = '';

        // Validace povinných polí
        if (!title || !description || !installationLinks) {
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
                    freewareBanner, // Nyní platforma místo URL
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
        Subject Banner (Optional)
        <select bind:value={subjectBanner}>
            <option value="">Select a subject</option>
            {#each subjectBannerOptions as option}
                <option value={option}>{option}</option>
            {/each}
        </select>
    </label>

    <label>
        Platform (Optional)
        <select bind:value={freewareBanner}>
            <option value="">Select a platform</option>
            {#each freewareBannerOptions as option}
                <option value={option}>{option}</option>
            {/each}
        </select>
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
