const COMMAND_KEYWORDS = {

    SET: "SET",
    GET: "GET",
    SADD: "SADD",
    SREM: "SREM",
    SMEMBERS: "SMEMBERS",
    SINTER: "SINTER",
    KEYS: "KEYS",
    DEL: "DEL",
    EXPIRE: "EXPIRE",
    TTL: "TTL",
    SAVE: "SAVE",
    RESTORE: "RESTORE",

}

const RESULT = {
    SUCCESS: "Success",
    ERROR: "ERROR: Key not found",
}

export { COMMAND_KEYWORDS, RESULT }