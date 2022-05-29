import App from "@/App";
import { mount } from "@vue/test-utils";

describe("Add notes", () => {
  it("Open add note panel", async () => {
    const wrapper = mount(App);
    expect(wrapper.find("#note-dialog").exists()).toBe(false);

    const addNoteBtn = wrapper.find("#notes-table__add");
    expect(addNoteBtn).toBeDefined();
    await addNoteBtn.trigger("click");
    expect(wrapper.find("#note-dialog").exists()).toBe(true);
  });

  it("Add note form validation", async () => {
    const wrapper = mount(App);

    const addNoteBtn = wrapper.find("#notes-table__add");
    await addNoteBtn.trigger("click");
    expect(
      wrapper.find("#note-dialog__controls button").attributes("disabled")
    ).toBe("disabled");
    await wrapper.find("#note-dialog input").setValue("test title");
    await wrapper.find("#note-dialog textarea").setValue("test content");
    expect(
      wrapper.find("#note-dialog__controls button").attributes("disabled")
    ).toBe(undefined);
  });

  it("Add note", async () => {
    const wrapper = mount(App);

    const addNoteBtn = wrapper.find("#notes-table__add");
    await addNoteBtn.trigger("click");
    wrapper.find("#note-dialog input").setValue("test title");
    await wrapper.find("#note-dialog textarea").setValue("test content");
    const saveNote = wrapper.find("#note-dialog__controls button.filled");
    saveNote.trigger("click");
    expect(wrapper.vm.$data.notes.length).toBe(4);
  });
});
