import { mount } from '@vue/test-utils';
import Line from "../../src/components/Line.vue";

describe("Line.vue", () => {
    it("renders a command", () => {
        const msg = "Success";
    
        const wrapper = mount(Line, {
            props: {
                text: msg
            }
        });
    
        expect(wrapper.html().includes(msg)).toBe(true);
    
    })
})