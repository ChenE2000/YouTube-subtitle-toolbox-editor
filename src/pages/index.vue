<script setup lang="ts">
const router = useRouter();
import ProjectCard from "~/components/ProjectCard.vue";
// import assets/dummy_projects.json
// import projects from "~/assets/dummy_projects.json";
import projectDataService from "~/api/project";

const projects = ref<any[]>([]);
onMounted(async () => {
  const res = await projectDataService.getAll();
  projects.value = res.data;
});

</script>

<template>
  <IndexHeader />
  <div>
    <h2 text-xl font-bold mb-4>
      Recent Projects
    </h2>

    <div class="project-list" flex="~ col gap-2">
      <ProjectCard v-for="project in projects" :project="project"></ProjectCard>
    </div>
  </div>
</template>

<style scoped></style>
