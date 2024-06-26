<script lang="ts">
	import * as data from '$lib/json/data.json';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import type { SubmitFunction } from './$types';
	import { enhance } from '$app/forms';
	import shuffle from '$lib/helper/shuffle';
	let images = data.data;
	shuffle(images);
	let counter = -1;
	let maxTime = 950;
	let myTime = new Date();
	let starTime = myTime.getTime();
	let endTime = myTime.getTime();
	let reactionTime = 0;
	let showTarget = false;
	let showLoading = false;
	let resultText = '';
	let form: HTMLFormElement;

	interface Subject {
		id: number;
		blank: string;
		target: string;
		race: string;
		isArmed: boolean;
	}
	//report
	let reactionTimes: number[] = [];
	let correct: Subject[] = [];
	let incorrect: Subject[] = [];
	let averageReaction = 0;

	let isCorrect = false;
	let isSlow = false;

	function startTest() {
		nextSequence();
	}

	function nextSequence() {
		counter++;
		resultText = '';
		if (counter == images.length) {
			const sum = reactionTimes.reduce((a, b) => a + b, 0);
			averageReaction = sum / reactionTimes.length || 0;
			resultText = `Test Completed!`;
			return;
		}
		showLoading = true;
		setTimeout(() => {
			showLoading = false;
			setTimeout(() => {
				showTarget = true;
				starTime = new Date().getTime();
			}, 2000);
		}, 3000);
	}

	function handleButtonClick(isSkull: boolean) {
		if (!showTarget) return;
		showTarget = false;
		endTime = new Date().getTime();
		reactionTime = endTime - starTime;
		reactionTimes.push(reactionTime);
		if (reactionTime > maxTime) {
			resultText = 'Too Slow';
			isCorrect = false;
			isSlow = true;
		} else if ((isSkull && images[counter].isArmed) || (!isSkull && !images[counter].isArmed)) {
			correct.push(images[counter]);
			resultText = 'Correct';
			isCorrect = true;
			isSlow = false;
		} else {
			incorrect.push(images[counter]);
			resultText = 'Incorrect';
			isCorrect = false;
			isSlow = false;
		}
		form.requestSubmit();
		setTimeout(nextSequence, 3000);
	}

	function onKeyDown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowRight':
				handleButtonClick(true);
				break;
			case 'ArrowLeft':
				handleButtonClick(false);
				break;
		}
	}

	//0.start press
	//1.show loading 3 s
	//2.show blank for 2 s
	//3.show target. calculate reaction time when user press fa-skull or fa-hand-spock button
	//4.show "too slow" text if reactionTime is bigger than maxTime. Show "incorrect" text if button value fa-hand-spock(weapon=false) does not match images[counter].weapon.
	//repeat the process from 1

	const enhanceForm: SubmitFunction = ({ formElement, formData, action, cancel, submitter }) => {
		formData.set('reactionTime', reactionTime.toString());
		formData.set('isBlack', String(images[counter].race == 'black'));
		formData.set('isArmed', String(images[counter].isArmed));
		formData.set('isCorrect', String(isCorrect));
		formData.set('isSlow', String(isSlow));
		return async ({ result, update }) => {
			await update();
		};
	};
</script>

<div class="flex h-screen flex-col items-center justify-center bg-gray-700">
	{#if counter == -1}
		<div class="flex flex-col p-6 items-center">
			<h1 class="h1 mb-6 text-wrap text-center  w-4/5">Police Officer's Dilemma</h1>
			<h4 class="h4 mb-6 text-wrap text-center w-3/5">On PC or Mac Use Left Arrow Key and Right Arrow Key to play.</h4>
			<button type="button" class="variant-filled-success btn btn-xl w-2/5" on:click={startTest}>
				<i class="fa-solid fa-hand-spock"></i>
				Start
			</button>
		</div>
	{:else}
		{#if counter < images.length}
			<div class="card flex items-center justify-center p-4">
				{#if showLoading}
					<ProgressRadial />
				{:else}
					<img src={showTarget ? `/target/${images[counter].target}`: `/blank/${images[counter].blank}`} alt="no target" />
				{/if}
			</div>
		{/if}
		<div class="my-2 flex w-full justify-between">
			<button
				type="button"
				class="variant-filled-success btn btn-xl"
				on:click={() => handleButtonClick(false)}
			>
				<i class="fa-solid fa-hand-spock"></i>
			</button>
			<button
				type="button"
				class="variant-filled-error btn btn-xl"
				on:click={() => handleButtonClick(true)}
			>
				<i class="fa-solid fa-skull"></i>
			</button>
		</div>
	{/if}

	{#if resultText}
		{#if resultText == 'Correct'}
			<aside class="alert variant-filled-primary w-full text-center">
				<div class="alert-message">
					<h3 class="h3">{resultText}</h3>
				</div>
			</aside>
		{:else if resultText == 'Incorrect'}
			<aside class="alert variant-filled-error w-full text-center">
				<div class="alert-message">
					<h3 class="h3">{resultText}</h3>
				</div>
			</aside>
		{:else if resultText == 'Too Slow'}
			<aside class="alert variant-filled-warning w-full text-center">
				<div class="alert-message">
					<h3 class="h3">{resultText}</h3>
				</div>
			</aside>
		{:else}
			<aside class="alert variant-filled-warning w-full text-center">
				<div class="alert-message">
					<h3 class="h3">Average Reaction Time: {averageReaction}ms</h3>
					<h3 class="h3">Correct: {correct.length}</h3>
					<h3 class="h3">Incorrect: {incorrect.length}</h3>
					<h3 class="h3">
						Black In Incorrect: {incorrect.filter((n) => n.race == 'black').length}
					</h3>
				</div>
			</aside>
		{/if}
	{/if}

</div>

<svelte:window on:keydown|preventDefault={onKeyDown} />
<form action="?/create" method="post" bind:this={form} use:enhance={enhanceForm} hidden></form>
