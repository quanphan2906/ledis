<template>
    <div class="console">
        <form @submit="submitCommand">
            <input type="text" v-model="command" />
        </form>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity';

export default {

    name: "CommandLine",

    emits: ["submit-command"],

    setup(_, { emit }) {
        
        const command = ref("");

        const submitCommand = (e) => {
            e.preventDefault();
            emit("submit-command", command.value);
            command.value = "";
        }

        return {
            command,
            submitCommand,
        }
    },

}

</script>


<style scoped>

.console {
    background-color: #000;
    color: white;
    position: fixed;
    bottom: 0;
    height: 15vh;
    width: 100%;
    padding: 0 4rem;
}

.console form {
    height: 100%;
}

.console input {
    background-color: #000;
    color: white;
    height: 100%;
    width: 100%;
    border: black;
    outline: none;
    font-size: 1.2rem;
}

</style>