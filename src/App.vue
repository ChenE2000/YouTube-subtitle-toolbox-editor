<template>
  <main font-sans px-20 text="gray-700 dark:gray-200" min-h-100vh>
    <a-config-provider :theme="{
      token: {
        colorPrimary: '#e93323',
      },
    }">
      <Suspense>
        <RouterView />
      </Suspense>
    </a-config-provider>

  </main>
</template>
