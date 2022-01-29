import { RESULT } from "../../src/mock-server/const";
import { processCommand } from "../../src/mock-server/server";

describe("server test", () => {

    beforeEach(() => {

        processCommand("RESET");
    })

    it("SET String value", () => {

        expect(processCommand("SET hello world")).toBe(RESULT.OK);
        expect(processCommand("SET hello")).toBe(RESULT.INVALID_USAGE);
        expect(processCommand("SET hello world this is great!")).toBe(RESULT.OK);
        expect(processCommand("SET")).toBe(RESULT.INVALID_USAGE);

        expect(processCommand("SET name quan")).toBe(RESULT.OK);
        expect(processCommand("SET name phan hoang")).toBe(RESULT.OK);
        
        expect(processCommand("GET hello")).toBe("world");
        expect(processCommand("GET name")).toBe("phan");
    })

    it("GET String value", () => {

        processCommand("SET hello world");
        processCommand("SET name quan");

        expect(processCommand("GET")).toBe(RESULT.INVALID_USAGE);
        expect(processCommand("GET hello")).toBe("world");
        expect(processCommand("GET name hello")).toBe("quan");
        expect(processCommand("GET nonexistkey")).toBe(RESULT.KEY_ERROR);
    })

    it("SADD add Set", () => {

        expect(processCommand("SADD")).toBe(RESULT.INVALID_USAGE);
        expect(processCommand("SADD languages")).toBe(RESULT.INVALID_USAGE);

        expect(processCommand("SADD languages Python Java C++")).toBe(3);
        expect(processCommand("SMEMBERS languages").sort()).toEqual(["Python", "Java", "C++"].sort());

        expect(processCommand("SADD languages Python C++ C# Kotlin")).toBe(2);
        expect(processCommand("SMEMBERS languages").sort()).toEqual(["Python", "Java", 
                                                                     "C++", "C#", 
                                                                     "Kotlin"].sort());
    });

    it("SMEMBERS return all members of set", () => {

        expect(processCommand("SMEMBERS")).toBe(RESULT.INVALID_USAGE);
        expect(processCommand("SMEMBERS languages")).toBe(RESULT.KEY_ERROR);

        processCommand("SADD languages Python Java C++");
        expect(processCommand("SMEMBERS languages").sort()).toEqual(["Python", "Java", "C++"].sort());

    })

    it("SREM remove values from Set", () => {

        expect(processCommand("SREM")).toBe(RESULT.INVALID_USAGE);
        expect(processCommand("SREM nonexisting")).toBe(0);
        expect(processCommand("SREM languages Python")).toBe(0);

        processCommand("SADD languages Python Java C++ C# Swift");

        expect(processCommand("SREM languages Python Java Kotlin")).toBe(2);
        expect(processCommand("SREM languages Javascript Dart")).toBe(0);
        expect(processCommand("SREM languages")).toBe(0);
        expect(processCommand("SMEMBERS languages").sort()).toEqual(["C++", "C#", "Swift"].sort());
    });

    it("SINTER set intersection between sets", () => {

        processCommand("SADD languages_1 Python Java Kotlin");
        processCommand("SADD languages_2 Python Java C++ C# Swift");

        expect(processCommand("SINTER")).toEqual([]);
        expect(processCommand("SINTER languages_1").sort()).toEqual(["Python", "Java", "Kotlin"].sort());
        expect(processCommand("SINTER languages_1 languages_2").sort()).toEqual(["Python", "Java"].sort());
        expect(processCommand("SINTER languages_1 languages_2 nonexisting")).toEqual([]);
    })

    it("KEYS List all keys", () => {

        expect(processCommand("KEYS")).toEqual([]);
        expect(processCommand("KEYS nonexistent1")).toEqual([]);
        
        processCommand("SET name quan");
        processCommand("SADD languages Python Java C++ C# Swift");
        processCommand("SET name phan");

        expect(processCommand("KEYS").sort()).toEqual(["languages", "name"].sort());

        processCommand("DEL name hello");
        expect(processCommand("KEYS").sort()).toEqual(["languages"].sort());
    })

    it("DEL Delete key", () => {
        expect(processCommand("DEL nonexisting")).toBe(RESULT.KEY_ERROR);

        processCommand("SET hello world");
        processCommand("SET name quan");
        processCommand("SADD languages Python Java");

        expect(processCommand("DEL hello name")).toBe(RESULT.OK);
        expect(processCommand("KEYS").sort()).toEqual(["name", "languages"].sort());

        expect(processCommand("DEL nonexisting languages")).toBe(RESULT.KEY_ERROR);
        expect(processCommand("KEYS").sort()).toEqual(["name", "languages"].sort());

        expect(processCommand("DEL name")).toBe(RESULT.OK);
        expect(processCommand("KEYS")).toEqual(["languages"]);
    })

    it("EXPIRE set expiration for key", () => {
        
        processCommand("SET hello world");
        processCommand("SADD languages Python Java");

        jest.useFakeTimers();

        expect(processCommand("EXPIRE hello 5")).toBe(5);
        expect(processCommand("GET hello")).toBe("world");
        
        jest.advanceTimersByTime(5000);

        expect(processCommand("GET hello")).toBe(RESULT.KEY_ERROR);

        jest.useRealTimers();
    })

    it("TTL query expiration of key", () => {

        processCommand("SET hello world");
        processCommand("EXPIRE hello 10");
        expect(processCommand("TTL hello")).toBe(10);
        expect(processCommand("TTL hello languages")).toBe(10);
        expect(processCommand("TTL languages")).toBe(RESULT.KEY_ERROR);
    })

    it("SAVE take snapshot of current database", () => {

        processCommand("SET hello world");
        processCommand("SADD languages Python Java");
        expect(processCommand("SAVE")).toBe(RESULT.OK);

        processCommand("DEL hello");
        processCommand("DEL languages");
        
        processCommand("RESTORE");
        expect(processCommand("GET hello")).toBe("world");
        expect(processCommand("SMEMBERS languages").sort()).toEqual(["Python", "Java"].sort());
        expect(processCommand("KEYS").sort()).toEqual(["hello", "languages"].sort());
    })

    it("RESTORE restore database from the last snapshot", () => {

        processCommand("SET hello world");
        processCommand("SADD languages Python Java");

        expect(processCommand("RESTORE")).toBe(RESULT.EMPTY_SNAPSHOT);

        processCommand("SAVE");

        processCommand("DEL hello");
        processCommand("DEL languages");
        
        expect(processCommand("RESTORE")).toBe(RESULT.OK);
        expect(processCommand("GET hello")).toBe("world");
        expect(processCommand("SMEMBERS languages").sort()).toEqual(["Python", "Java"].sort());
        expect(processCommand("KEYS").sort()).toEqual(["hello", "languages"].sort());
    })

})