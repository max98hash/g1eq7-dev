<template>
  <v-app id="inspire">
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <router-link :to="{ name: 'Home' }">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </router-link>
    </v-app-bar>

    <v-main class="ml-10">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      title: "Conduite de Projet",
      drawer: null,
    };
  },
};
</script>

<style>
a {
  text-decoration: none !important;
  color: inherit !important;
}
</style>
