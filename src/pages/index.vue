<script setup lang="ts">
const router = useRouter();
// import assets/dummy_projects.json
import projects from "~/assets/dummy_projects.json";

// const titles = [
//   "The Best Way to Learn Vue.js",
//   "Vue.js in 2021 - What You Need to Know",
//   "How to Build a Vue.js Application in Under 60 Minutes",
//   "Vue.js Fundamentals - The What, Why and How",
//   "Vue.js 3 is Here! Learn What's New",
//   "How to Build a Vue.js Chat App with Chatkit",
// ];

function goToProject(id: number) {
  router.push(`/project/${id}`);
}
function goToEditor() {
  router.push(`/editor`);
}

</script>

<template>
  <IndexHeader />
  <div>
    <h2 text-xl font-bold mb-4>
      Recent Projects
    </h2>
    <div class="project-list" flex="~ col gap-2">
      <div v-for="(project, index) in projects.data" :key="index">
        <a class="link" cursor-pointer @click="goToProject(index)">
          {{ project.title }}
          <div class="overlay" w-48 rounded bg-white overflow-hidden>
            <div w-full h-24>
              <img w-full h-full object-cover :src="project.thumbnail" alt="">
            </div>
            <div p="x-4 y-2" flex="~ gap-2 items-center">
              <div w-8 h-8 rounded-full overflow-hidden>
                <img w-full h-full src="https://plus.unsplash.com/premium_photo-1690366911099-0c0e170c9a51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEwfFM0TUtMQXNCQjc0fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=800&q=60" alt="">
              </div>
              <span>{{ project.uploader }}</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.link {
  position: relative;
  display: inline-block;
}

.link::after {
  content: "";
  position: absolute;
  height: 2px;
  background-color: #000;
  left: 0;
  right: 0;
  bottom: -2px;
  transform-origin: 0 0;
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

.link:hover::after {
  transform: scaleX(1);
  transition: transform 0.3s ease-in-out;
}

.link:hover .overlay {
  transform: translate(-50%, 12px) scaleY(1);
}

.link .overlay {
  position: absolute;
  z-index: 1;
  border: 1px solid black;
  left: 50%;
  transform: translate(-50%, 12px) scaleY(0);
  transform-origin: 0 0;
  transition: transform 0.3s ease-in-out;
}
</style>
