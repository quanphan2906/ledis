<template>
	<div class="results-wrapper">
		<Line v-for="line in lines" :text="line" />
	</div>
	<CommandLine @submit-command="handleCommandSubmit" />
</template>

<script>
import { ref } from '@vue/reactivity'
import CommandLine from "./components/CommandLine.vue"
import Line from "./components/Line.vue"

import { processCommand } from "./mock-server/server"

export default {

	name: "App",

	components: {
		CommandLine,
		Line
	},

	setup() {
		
		const lines = ref([]);

		const handleCommandSubmit = ( newCommand ) => {
			lines.value.push("> " + newCommand);
			let result = processCommand(newCommand);

			if (Array.isArray(result)) {

				for (let i = 0; i < result.length; i++) {
					lines.value.push(i + 1 + ") " + result[i]);
				}

				if (result.length == 0) {
					lines.value.push("Empty set");
				}

			} else {
				lines.value.push(result);
			}
		}

		return {
			lines,
			handleCommandSubmit,
		}
	},
}


</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap');

#app {
	font-family: 'Source Code Pro', monospace;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}

body {
	margin: 0;
	height: 100%;
	width: 100%;
    font-size: 1.2rem;
}

input[type="text"]
{
    font-family: 'Source Code Pro', monospace;
}

.results-wrapper {
	height: 85vh;
	overflow-y: scroll;
}

</style>
