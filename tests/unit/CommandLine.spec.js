import { mount } from '@vue/test-utils';
import CommandLine from "../../src/components/CommandLine.vue";

describe("CommandLine.vue", () => {

    it("renders a command", async () => {

        const command = "SET hello world";
    
        const wrapper = mount(CommandLine);

        const form = wrapper.find("form");
        const textInput = wrapper.find("input[type='text']");
        
        await textInput.setValue(command)
        await form.trigger("submit.prevent");
    
        expect(wrapper.emitted()).toHaveProperty("submit-command");
        expect(textInput.element.value).toBe("");
    })

})