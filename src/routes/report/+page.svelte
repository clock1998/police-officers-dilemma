<script lang="ts">
	import type { PageData, SubmitFunction } from './$types';
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	export let data: PageData;
	$: ({ results } = data);

	let chartCanvas: HTMLCanvasElement;
	let pieChartCanvas: HTMLCanvasElement;
	let responseTimeChartCanvas: HTMLCanvasElement;
	let errorsChartCanvas: HTMLCanvasElement;

	onMount(async () => {
		const calculateAverages = (data: any) => {
			let groups = [
				{ isArmed: false, isBlack: false },
				{ isArmed: false, isBlack: true },
				{ isArmed: true, isBlack: false },
				{ isArmed: true, isBlack: true }
			];

			let averages = groups.map((group) => {
				let filtered = data.filter(
					(d) => d.isArmed === group.isArmed && d.isBlack === group.isBlack
				);
				let averageReactionTime =
					filtered.reduce((sum, d) => sum + d.reactionTime, 0) / filtered.length;
				let errorRate =
					(filtered.filter((d) => !d.isCorrect || d.isSlow).length / filtered.length) * 100;
				return {
					...group,
					averageReactionTime,
					errorRate
				};
			});
			return averages;
		};

		const averages = calculateAverages(results);

		var responseTimeChart = new Chart(responseTimeChartCanvas, {
			type: 'bar',
			data: {
				labels: ['Unarmed White', 'Unarmed Black', 'Armed White', 'Armed Black'],
				datasets: [
					{
						label: 'Reaction Time (ms)',
						data: averages.map((a) => a.averageReactionTime),
						backgroundColor: 'rgb(54, 162, 235)'
					}
				]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Reaction Time (ms)'
						}
					}
				}
			}
		});

		var errorsChart = new Chart(errorsChartCanvas, {
			type: 'bar',
			data: {
				labels: ['Unarmed White', 'Unarmed Black', 'Armed White', 'Armed Black'],
				datasets: [
					{
						label: 'Error Rate (%)',
						data: averages.map((a) => a.errorRate),
						backgroundColor: 'rgb(255, 99, 132)'
					}
				]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Error Rate (%)'
						}
					}
				}
			}
		});

		const pieData = {
			labels: ['Correct', 'Incorrect', 'Too Slow'],
			datasets: [
				{
					label: 'Accuracy',
					data: [
						results.filter((n) => n.isCorrect).length,
						results.filter((n) => !n.isCorrect).length,
						results.filter((n) => n.isSlow).length
					],
					backgroundColor: ['rgb(54, 162, 235)', 'rgb(255, 99, 132)', 'rgb(255, 205, 86)'],
					hoverOffset: 4
				}
			]
		};
		var pieChart = new Chart(pieChartCanvas, {
			type: 'pie',
			data: pieData
		});
	});

	const enhanceForm: SubmitFunction = ({ formElement, formData, action, cancel, submitter }) => {
		return async ({ result, update }) => {
			await update();
		};
	};
</script>

<div class="flex flex-col">
	<div class="flex flex-col items-center justify-center">
		<div style="width: 800px;"><canvas bind:this={chartCanvas} id="myChart"></canvas></div>
		<div style="width: 500px;"><canvas bind:this={pieChartCanvas}></canvas></div>
		<div style="width: 800px;"><canvas bind:this={responseTimeChartCanvas}></canvas></div>
		<div style="width: 800px;"><canvas bind:this={errorsChartCanvas}></canvas></div>
	</div>
	<form action="?/delete" method="post" use:enhance={enhanceForm}>
		<button type="submit" class="btn-info btn m-2 w-full hover:bg-blue-500">Reset</button>
	</form>
</div>
