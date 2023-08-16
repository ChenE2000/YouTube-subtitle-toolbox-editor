<script setup lang="ts">
const router = useRouter();
function newProject() {
  router.push(`/project/new`);
}
</script>

<template>
  <header p="y-4" flex="~ items-center">
    <h1 text="gray 3xl" font="bold">
      <span style="color: #e93323;">Subtitle</span> toolbox
    </h1>
    <a-button @click="newProject" ml-auto>
      New Project
    </a-button>
  </header>
</template>
