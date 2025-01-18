<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let reports = [];
    let loading = true;

    async function fetchReports() {
        try {
            const res = await fetch('/admin/reports');
            if (res.ok) {
                reports = await res.json();
            } else {
                console.error('Chyba při načítání reportů:', await res.text());
            }
        } catch (error) {
            console.error('Chyba při načítání reportů:', error);
        } finally {
            loading = false;
        }
    }

    async function handleAction(reportId, postId, action) {
        try {
            const res = await fetch('/admin/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action, reportId, postId })
            });

            if (res.ok) {
                await fetchReports(); // Refresh the data after the action
            } else {
                console.error('Chyba při zpracování akce:', await res.text());
            }
        } catch (error) {
            console.error('Chyba při zpracování akce:', error);
        }
    }

    onMount(fetchReports);
</script>

{#if loading}
    <p>Načítání nahlášení...</p>
{:else if reports.length === 0}
    <p>Žádná nahlášení k zobrazení.</p>
{:else}
    <table>
        <thead>
            <tr>
                <th>ID nahlášení</th>
                <th>Důvod</th>
                <th>Datum nahlášení</th>
                <th>ID příspěvku</th>
                <th>Název příspěvku</th>
                <th>Možnosti</th>
            </tr>
        </thead>
        <tbody>
            {#each reports as report}
                <tr>
                    <td>{report.report_id}</td>
                    <td>{report.reason}</td>
                    <td>{new Date(report.reported_at).toLocaleString()}</td>
                    <td>
                        <a href={`/posts/${report.post_id}`} target="_blank">
                            {report.post_id}
                        </a>
                    </td>
                    <td>{report.post_title}</td>
                    <td>
                        <button on:click={() => handleAction(report.report_id, report.post_id, 'accept')}>
                            Přijmout
                        </button>
                        <button on:click={() => handleAction(report.report_id, null, 'delete')}>
                            Odstranit
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}
