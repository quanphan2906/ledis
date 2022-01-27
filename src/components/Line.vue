<template>
    <div class="line">
        {{ text }}
    </div>
</template>


<script>

export default {
    name: "Line",
    props: ["text"],
}

</script>


<style scoped>

.line {
    display: flex;
    align-items: center;
    height: 10%;
    padding: 0 4rem;
}

</style>