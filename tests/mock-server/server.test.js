import { RESULT } from "../../src/mock-server/const";
import { processCommand } from "../../src/mock-server/server";

describe("server test", () => {

    beforeEach(() => {

        processCommand("RESET");
    })

    it("SET String value", () => {

        expect(processCommand("SET hello world")).toBe(RESULT.SUCCESS);
        expect(processCommand("SET hello")).toBe(RESULT.INVALID_USAGE);
        expect(processCommand("SET hello world this is great!")).toBe(RESULT.SUCCESS);
        expect(processCommand("SET")).toBe(RESULT.INVALID_USAGE);

        expect(processCommand("SET name quan")).toBe(RESULT.SUCCESS);
        expect(processCommand("SET name phan hoang")).toBe(RESULT.SUCCESS);
        
        expect(processCommand("GET hello")).toBe("world");
        expect(processCommand("GET name")).toBe("phan");
    })

    it("GET String value", () => {

        processCommand("SET hello world");
        processCommand("SET name quan");

        expect(processCommand("GET hello")).toBe("world");
        expect(processCommand("GET")).toBe(RESULT.INVALID_USAGE);
        expect(processCommand("GET hello name")).toBe("world");
    })

    it("SADD add Set", () => {

        expect(processCommand("SET languages Python")).toBe(RESULT.SUCCESS);
        expect(processCommand("SADD languages Python Java C++")).toBe(RESULT.SUCCESS);

        expect(processCommand("SMEMBERS languages").sort()).toEqual(["Python", "Java", "C++"].sort());

        expect(processCommand("SADD languages")).toBe(RESULT.INVALID_USAGE);
        expect(processCommand("SADD")).toBe(RESULT.KEY_ERROR);
        expect(processCommand("SADD languages C# Kotlin Swift")).toBe(RESULT.SUCCESS);

        expect(processCommand("SMEMBERS languages").sort()).toEqual(["Python", "Java", 
                                                                     "C++", "C#", 
                                                                     "Kotlin", "Swift"].sort());                                                     
  
    });

    // it("SREM remove values from Set")

})