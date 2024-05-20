<script lang="ts">
	import type { PageData, SubmitFunction } from './$types';
    import { enhance } from '$app/forms';

	export let data: PageData;
	$: ({ results } = data);

    const enhanceForm: SubmitFunction = ({ formElement, formData, action, cancel, submitter }) => {
		return async ({ result, update }) => {
			await update();
		};
	};

</script>

{#each results as i}
	<div>{i.id}</div>
{/each}
<form
    class="w-2/4 flex flex-col items-center"
    action="?/delete"
    method="post"
    use:enhance={enhanceForm}
    >
    <button type="submit" class="btn btn-info w-full m-2 hover:bg-blue-500">Reset</button>
</form>