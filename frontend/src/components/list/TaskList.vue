<template>
  <div class="taskList__container">
    <h1>
      Tasks
      <router-link :to="{ name: 'CreateTask' }">
        <v-btn fab class="success"> <v-icon> mdi-plus</v-icon></v-btn>
      </router-link>
    </h1>

    <v-row v-if="$store.state.taskOfCurrentProject.length === 0">
      <v-spacer></v-spacer>
      <v-col cols="8" sm="4" class="align-center">
        <v-alert class="red lighten-2">
          No Task?
          <router-link :to="{ name: 'CreateTask' }">
            Create one here
          </router-link>
        </v-alert>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>

    <v-simple-table class="mt-10 mr-10" v-else>
      <template v-slot:default>
        <thead>
          <th class="text-center" id="id">
            Id
          </th>
          <th class="text-center" id="name">
            Name
          </th>
          <th class="text-center" id="US">
            US
          </th>
          <th class="text-center" id="dependencies">
            Dependencies
          </th>
          <th class="text-center" id="time">
            Time
          </th>
          <th class="text-center" id="devs">
            Devs
          </th>
          <th class="text-center" id="doing">
            State
          </th>
        </thead>
        <tbody>
          <tr v-for="task in $store.state.taskOfCurrentProject" :key="task._id">
            <td>{{ task._id }}</td>
            <td>{{ task.name }}</td>
            <td>{{ task.idUs }}</td>
            <td>
              <div v-if="task.dependencies.length === 0">\</div>
              <div
                v-for="(dependency,index) in task.dependecies"
                :key="index"
              >
                {{ dependency }}
              </div>
            </td>
            <td>{{ task.time }}</td>
            <td>

              {{ task.dev }}
            </td>
            <td>{{ task.state }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  props: {
    idProject: String,
  },
  data() {
    return {
      tasks: [],
    };
  },
  mounted() {
    this.$store.commit("GET_TASK_OF_PROJECT", this.idProject);
  },
};
</script>

<style>
a {
  font-weight: 0;
}
</style>
