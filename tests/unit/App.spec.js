import { mount } from '@vue/test-utils';
import App from "../../src/App.vue";
import CommandLine from "../../src/components/CommandLine.vue";
import Line from "../../src/components/Line.vue";


const withWrapperArray = (wrapperArray) => {

    return {

        childSelectorHasText: (selector, str) => 
            wrapperArray.filter(i => i.find(selector).text().match(str)),

        hasText: (str) => wrapperArray.filter(i => i.text().match(str)),
    }
}

describe("App.vue", () => {

    it("Add lines after command line is submitted", async () => {
        const wrapper = mount(App);

        const commandLine = wrapper.findComponent(CommandLine);
        const command = "SET hello world";

        expect(commandLine.exists()).toBe(true);
        
        await commandLine.vm.$emit("submit-command", command);

        const lines = wrapper.findAllComponents(Line);

        const commandEle = withWrapperArray(lines).hasText("> " + command).at(0);
        expect(commandEle.exists()).toBe(true);

        const resultEle = withWrapperArray(lines).hasText("OK").at(0);
        expect(resultEle.exists()).toBe(true);
    })

})