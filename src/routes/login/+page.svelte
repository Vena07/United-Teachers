<script>
	import { goto } from '$app/navigation';

	let loginSuccess = false;
	let notification = '';
	let nickname = '';
	let password = '';
	let rememberMe = false; // Stav pro "Zapamatovat si mě"

	async function login(event) {
		event.preventDefault();
		notification = '';

		const formData = new FormData();
		formData.append('nickname', nickname);
		formData.append('password', password);
		formData.append('rememberMe', rememberMe ? 'true' : 'false'); // Přidáme hodnotu pro "Zapamatovat si mě"

		try {
			const response = await fetch('/login', {
				method: 'POST',
				body: formData,
			});

			const result = await response.json();

			if (response.ok) {
				if (result.success) {
					loginSuccess = true;
					setTimeout(() => {
						goto('/profile');
					}, 1000);
				} else {
					notification = result.message;
				}
			} else {
				notification = result.message || 'An unexpected error occurred. Please try again later.';
			}
		} catch (error) {
			notification = 'An unexpected error occurred. Please try again later.';
			console.error(error);
		}
	}
</script>

<form on:submit={login}>
	<h1>LOGIN</h1>
	<label>
		Nick
		<input type="text" bind:value={nickname} required />
	</label>
	<label>
		Heslo
		<input type="password" bind:value={password} required />
	</label>
	<div>
		<input type="checkbox" bind:checked={rememberMe} />
		<span>Remember me</span>
	</div>
	<button type="submit"><strong>Přihlásit se</strong></button>
	<div>
		<a href="/register">Nová registrace</a>
		<a href="/forgot-password">Zapomenuté heslo</a>
	</div>
</form>

{#if notification}
	<div class="notification">{notification}</div>
{/if}
