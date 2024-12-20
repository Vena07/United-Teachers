<script>
	let newPassword = '';
	let confirmPassword = '';
	let notification = '';
	let token = '';

	export let data;

	token = data.props.User1.token;

	console.log('Token in +page.svelte:', token);

	function validatePassword(password) {
		const minLength = 8;
		const hasUpperCase = /[A-Z]/.test(password);
		const hasNumber = /\d/.test(password);

		if (password.length < minLength) {
			return 'Password must be at least 8 characters long.';
		}
		if (!hasUpperCase) {
			return 'Password must contain at least one uppercase letter.';
		}
		if (!hasNumber) {
			return 'Password must contain at least one number.';
		}
		return null;
	}

	async function resetPassword() {
		const validationError = validatePassword(newPassword);

		if (validationError) {
			notification = validationError;
			return;
		}

		if (newPassword !== confirmPassword) {
			notification = 'Passwords do not match.';
			return;
		}

		const formData = new FormData();
		formData.append('newPassword', newPassword);
		formData.append('token', token);

		console.log('Form data before sending:', {
			newPassword,
			token,
		});

		const response = await fetch('/login/reset-password', {
			method: 'POST',
			body: formData,
		});

		if (response.ok) {
			notification = 'Password has been successfully changed. Redirecting to login...';
		} else {
			const result = await response.json();
			notification = result.message;
		}
	}
</script>

<div>
	<div>
		<h1>Reset Password</h1>

		<form on:submit|preventDefault={resetPassword}>
			<input type="password" bind:value={newPassword} placeholder="Enter new password" required />
			<input type="password" bind:value={confirmPassword} placeholder="Confirm new password" required />

			<div>
				<button type="submit">Change</button>
				<a href="/profile">Home</a>
			</div>
		</form>

		{#if notification}
			<div>{notification}</div>
		{/if}
	</div>
</div>
