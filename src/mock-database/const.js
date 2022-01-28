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
    KEY_ERROR: "ERROR: Key not found",
    COMMAND_ERROR: "ERROR: Command not valid",
    INVALID_USAGE: "ERROR: Arguments of command are invalid or not enough",
}

export { COMMAND_KEYWORDS, RESULT }