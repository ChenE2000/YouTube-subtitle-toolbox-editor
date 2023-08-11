<script setup lang="ts">
const router = useRouter();
function goToEditor() {
  router.push(`/editor`);
}
</script>

<template>
  <header p="y-4" flex="~ items-center">
    <h1 text="gray 3xl" font="bold">
      <span text-primary>Subtitle</span> toolbox
    </h1>
    <a-button @click="goToEditor" ml-auto>
      New Project
    </a-button>
  </header>
</template>
