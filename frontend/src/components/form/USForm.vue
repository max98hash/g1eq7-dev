<template>
  <div class="usForm">
    <h1 v-if="isEdit">Edit</h1>
    <h1 v-else>Create US</h1>
    <v-form ref="form" v-model="valid" lazy-validation justify="center">
      <v-row>
        <v-col cols="12" sm="8">
          <v-textarea
            label="Description"
            filled
            id="description"
            v-model="description"
            :rules="[usValidator]"
            placeholder="As a devellopeur I wan't to code so i'm productive "
            required
            auto-grow
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="8">
          <v-select
            :items="stateList"
            label="State"
            filled
            v-model="state"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="3">
          <v-select
            :items="numberList"
            label="Priority"
            v-model="priority"
            filled
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-select
            :items="numberList"
            label="Difficulty"
            v-model="difficulty"
            filled
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="4">
          <!-- End date datepicker -->
          <v-menu
            ref="menuEnd"
            v-model="menuEnd"
            :close-on-content-click="false"
            :return-value.sync="dateClose"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateClose"
                label="Estimated end date"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                filled
              ></v-text-field>
            </template>
            <v-date-picker v-model="dateClose" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menuEnd = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.menuEnd.save(dateClose)"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-btn
          color="success"
          class="mr-6"
          v-if="isEdit"
          @click="modify"
          :disabled="!valid"
        >
          Save
        </v-btn>

        <v-btn
          color="success"
          class="mr-6"
          v-else
          @click="create"
          :disabled="!valid"
        >
          Add
        </v-btn>
        <v-btn color="error" @click="cancel" outlined>Cancel</v-btn>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { serverurl, port } from "../../config/backend.config";
import axios from "axios";

export default {
  props: {
    isEdit: Boolean,
    us: Object,
  },
  data() {
    return {
      description: this.us ? this.us.description : "",
      type: this.us ? this.us.type : "NewFeature",
      state: this.us ? this.us.state : "OPEN",
      priority: this.us ? this.us.priority : 1,
      difficulty: this.us ? this.us.difficulty : 1,
      idProject: this.us ? this.us.idProject : this.$route.params.idProject,
      id: this.us ? this.us._id : null,
      sprintId: this.us ? this.us.sprintId : null,
      dateClose: this.us ? this.us.dateClose : null,

      menuEnd: false,
      stateList: ["OPEN", "PLANNIFIED", "CLOSED"],
      numberList: [1, 2, 3, 4, 5],
      usRegExHead: new RegExp("^As a"),
      usRegExMid: new RegExp("I wan't"),
      usRegExpTail: new RegExp("(so)?"),

      usValidator: (v) =>
        this.isUserStory(v) || "US must be: As a ... I wan't to ... so? ...",
      valid: false,
    };
  },

  methods: {
    isUserStory(us) {
      return (
        this.usRegExHead.test(us) &&
        this.usRegExMid.test(us) &&
        this.usRegExpTail.test(us)
      );
    },
    create() {
      if (this.description.trim().length === 0) {
        alert("You can't create US with no description");
        return;
      }

      console.log("Create ");
      console.log(this.createPostData());
      axios
        .post(
          `http://${serverurl}:${port}/project/${this.idProject}/us/create/`,
          this.createPostData()
        )
        .then(() => {
          this.$store.commit("GET_US_OF_PROJECT", this.idProject);
          this.$router.back();
        });
    },
    modify() {
      console.log("Modify...");
      axios
        .post(
          `http://${serverurl}:${port}/project/${this.idProject}/us/${this.id}/modify/`,
          this.createPostData()
        )
        .then(() => {
          this.$store.commit("GET_US_OF_PROJECT", this.idProject);
          this.$router.back();
        });
    },
    cancel() {
      console.log("Cancel");
      this.$router.back();
    },

    createPostData() {
      if(this.us){
        if(this.us.state != "CLOSED" && this.state == "CLOSED"){
          return {
            _id: this.id,
            description: this.description,
            priority: this.priority,
            state: this.state,
            difficulty: this.difficulty,
            idProject: this.idProject,
            sprintId: this.sprintId,
            dateClose: this.dateClose ? this.dateClose : new Date(),
          };
        }else{
          if(this.us.state == "CLOSED" && this.state != "CLOSED"){
            return {
            _id: this.id,
            description: this.description,
            priority: this.priority,
            state: this.state,
            difficulty: this.difficulty,
            idProject: this.idProject,
            sprintId: this.sprintId,
            dateClose: null
          };
          }else{
            return {
            _id: this.id,
            description: this.description,
            priority: this.priority,
            state: this.dateClose ? "CLOSED" : this.state,
            difficulty: this.difficulty,
            idProject: this.idProject,
            sprintId: this.sprintId,
            dateClose: this.dateClose,
            };
          }
        }
      }else{
        if(this.state != "CLOSED"){
          return {
            _id: this.id,
            description: this.description,
            priority: this.priority,
            state: this.state,
            difficulty: this.difficulty,
            idProject: this.idProject,
            sprintId: this.sprintId,
            dateClose: null
          };
        }else{
          return {
            _id: this.id,
            description: this.description,
            priority: this.priority,
            state: this.state,
            difficulty: this.difficulty,
            idProject: this.idProject,
            sprintId: this.sprintId,
            dateClose: new Date(),
          };
        }
        
      }
      
      
    },
  },
  mounted() {},
};
</script>

<style></style>
