<script lang="ts">
	let registrationSuccess = false;
	let email = '';
	let nickname = '';
	let password = '';
	let confirmPassword = '';
	let jmeno = '';
	let prijmeni = '';
	let datum_nar = '';
	let notification = '';

	// Funkce pro validaci hesla
	function validatePassword(password: string) {
		const errors = [];
		if (!/[A-Z]/.test(password)) {
			errors.push('The password must contain at least one uppercase letter.');
		}
		if (!/[0-9]/.test(password)) {
			errors.push('The password must contain at least one number.');
		}
		if (password.length < 8) {
			errors.push('The password must be at least 8 characters long.');
		}
		return errors;
	}

	// Funkce pro registraci uživatele
	async function register() {
		notification = '';

		// Kontrola, jestli hesla odpovídají
		if (password !== confirmPassword) {
			notification = 'Passwords do not match.';
			return;
		}

		// Validace hesla
		const passwordErrors = validatePassword(password);
		if (passwordErrors.length > 0) {
			notification = passwordErrors.join(' ');
			return;
		}

		// Příprava dat z formuláře
		const formData = new FormData();
		formData.append('email', email);
		formData.append('nickname', nickname);
		formData.append('password', password);
		formData.append('jmeno', jmeno);
		formData.append('prijmeni', prijmeni);
		formData.append('datum_nar', datum_nar);

		try {
			const response = await fetch('/register', {
				method: 'POST',
				body: formData,
			});

			const result = await response.json();
			if (response.ok && result.success) {
				registrationSuccess = true;
				notification = result.message;
			} else {
				notification = result.message || 'An error occurred during registration.';
			}
		} catch (error) {
			console.error('Error during registration:', error);
			notification = 'Failed to connect to the server.';
		}
	}
</script>
		




<form on:submit|preventDefault={register} >
    <h1>REGISTRACE</h1>
    
	<label>
        Jméno
        <input type="text" bind:value={jmeno}  required >
    </label>
	<label>
        Přijmení
        <input type="text" bind:value={prijmeni} required >
    </label>
	
	<label >
        Nickname
        <input type="text" bind:value={nickname}  required>
    </label>
    <label >
        E-mail
        <input type="email" bind:value={email} required >
    </label>
    <label>
        Heslo
        <input type="password" bind:value={password} required >
    </label>
    <label>
        Potvrzeni hesla
        <input type="password" bind:value={confirmPassword}  required >
    </label>
	<label>
        Datum 
		<input type="date" bind:value={datum_nar} required >
    </label>
    <button type="submit"><strong>Vytvořit účet</strong></button>
    <div>
        <a href="/login">Již máte učet?</a>
    </div>
	</form>
		{#if notification}
			<p>{notification}</p>
		{/if}

		{#if registrationSuccess}
			<p>Registration successful! Check your email to verify your account.</p>
		{/if}