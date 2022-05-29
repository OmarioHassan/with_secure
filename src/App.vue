<template>
  <div id="app">
    <!-- Table Summary  -->
    <ul id="table-summary">
      <li><span>total</span> {{ notes.length }}</li>
      <li><span>completed</span>{{ getNotesCount("completed") }}</li>
      <li><span>not completed</span>{{ getNotesCount("not_completed") }}</li>
    </ul>
    <div></div>
    <!-- Notes Table -->
    <div id="notes-table">
      <table>
        <thead>
          <tr>
            <th v-for="(th, index) in table_th" :key="th">
              <input
                @click="selectAllNotes()"
                v-if="index == 0"
                type="checkbox"
                :checked="
                  selectedNotes.length === notes.length && selectedNotes.length
                "
              />{{ th }}
              <div class="sort-icons" @click="sortNotes(th.toLowerCase())">
                <span
                  :class="{ active: isActiveSortBtn(th.toLowerCase(), -1) }"
                ></span>
                <span
                  :class="{ active: isActiveSortBtn(th.toLowerCase(), 1) }"
                ></span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="note in notes" :key="note.id">
            <td>
              <label :for="note.id"
                ><input
                  :id="note.id"
                  :value="note.id"
                  v-model="selectedNotes"
                  type="checkbox"
                />
                {{ note.id }}</label
              >
            </td>
            <td>{{ note.title }}</td>
            <td>{{ note.content }}</td>
            <td>{{ note.status }}</td>
          </tr>
        </tbody>
      </table>
      <button class="filled" id="notes-table__add" @click="openNotesDialog()">
        Add
      </button>
    </div>
    <!-- Action Panel -->
    <div id="action-panel" v-if="selectedNotes.length">
      <p>
        <img :src="alertIcon" alt="" /> Do you want to delete
        {{ selectedNotes.length > 1 ? "these notes" : "this note" }}?
      </p>
      <div id="action-panel__controls">
        <button @click="selectedNotes = []">No</button>
        <button
          class="filled"
          @click="
            removeNotes();
            selectedNotes = [];
          "
        >
          Yes
        </button>
      </div>
    </div>
    <!-- Add Note Dialog -->
    <form
      id="note-dialog"
      v-if="showNotesDialog"
      @keyup.enter="isFormValid() ? saveNote() : ''"
    >
      {{ newNote }}
      <h4>Add note</h4>
      <input
        type="text"
        placeholder="Add title"
        v-model="newNote.title"
        ref="noteTitleRef"
      />
      <textarea placeholder="Add Content" v-model="newNote.content"></textarea>
      <div id="note-dialog__controls">
        <button class="filled" @click="saveNote()" :disabled="!isFormValid()">
          Save
        </button>
        <button
          @click="
            showNotesDialog = false;
            resetForm();
          "
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import alertIcon from "./assets/alert.svg";
import notes from "./assets/data.json";
export default {
  name: "App",
  data() {
    return {
      showNotesDialog: false,
      selectedNotes: [],
      newNote: {},
      sortBtn: {
        key: "",
        order: -1,
      },
      alertIcon,
      notes,
      latestNoteId: 0,
      table_th: ["ID", "Title", "Content", "Status"],
    };
  },
  methods: {
    openNotesDialog() {
      this.showNotesDialog = true;
      setTimeout(() => {
        this.$refs.noteTitleRef.focus();
      }, 100);
    },
    resetForm() {
      this.newNote = {
        id: this.latestNoteId + 1,
        title: "",
        content: "",
        status: "New",
      };
      this.showNotesDialog = false;
    },
    saveNote() {
      this.notes.push(this.newNote);
      this.latestNoteId++;
      this.resetForm();
    },
    isFormValid() {
      return !!this.newNote.title && !!this.newNote.content.trim();
    },
    getNotesCount(type) {
      return this.notes.filter(
        (note) => note.status.toLowerCase() === type.replace("_", " ")
      ).length;
    },
    sortNotes(sortBy) {
      if (this.sortBtn.key === sortBy) {
        // Same Filter
        this.sortBtn.order = -1 * this.sortBtn.order;
      } else {
        this.sortBtn.order = -1;
      }
      this.sortBtn.key = sortBy;

      this.notes = this.notes.sort((a, b) =>
        a[sortBy] < b[sortBy] ? 1 * this.sortBtn.order : -1 * this.sortBtn.order
      );
    },
    selectAllNotes() {
      this.selectedNotes =
        this.selectedNotes.length === this.notes.length
          ? []
          : this.notes.map((note) => note.id);
    },
    isActiveSortBtn(key, order) {
      return this.sortBtn.key === key && this.sortBtn.order === order;
    },
    removeNotes() {
      this.notes = this.notes.filter(
        (note) => !this.selectedNotes.includes(note.id)
      );
    },
  },
  mounted() {
    this.latestNoteId = this.notes.length;
    this.resetForm();
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap");
@import "./App.scss";
</style>
