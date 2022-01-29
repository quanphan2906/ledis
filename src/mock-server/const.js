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
    RESET: "RESET",

}

const RESULT = {
    OK: "OK",
    KEY_ERROR: "ERROR: Key not found",
    COMMAND_ERROR: "ERROR: Unknown command",
    INVALID_USAGE: "ERROR: Arguments of command are invalid or not enough",
    EMPTY_SNAPSHOT: "ERROR: There has not been any snapshot yet",
    NOT_SET: "ERROR: Value at key is not a set",
    EMPTY_SET: "ERROR: Empty set",
}

export { COMMAND_KEYWORDS, RESULT }