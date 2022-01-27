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

const add = (databaseValue, key, value) => {
    if ( Array.isArray(value) ) {
        value = new Set(value);
    }

    databaseValue[key] = value;
    return { result: RESULT.SUCCESS, newDatabaseValue: databaseValue };
}

const getString = (databaseValue, key) => {
    if ( key in databaseValue && typeof databaseValue[key] !== "object" ) {

        return { result: databaseValue[key], newDatabaseValue: databaseValue };
    } else throw RESULT.ERROR;
}

const deleteFromSet = (databaseValue, key, values) => {
    if ( key in databaseValue ) {
        
        for (value in values) {
            databaseValue[key].delete(value);
        }

        return { result: RESULT.SUCCESS, newDatabaseValue: databaseValue }
    } else throw RESULT.ERROR;
}

const getSet = (databaseValue, key) => {
    if ( key in databaseValue & typeof databaseValue[keys] == "object" ) {

        return { result: Array.from(databaseValue[key]), newDatabaseValue: databaseValue };
    } else throw RESULT.ERROR;
}


const processCommand = (command, databaseValue) => {

    let result = RESULT.ERROR;
    let newDatabaseValue = databaseValue;

    const commandEles = command.trim().replace(/\s+/g, " ").split(" ");
    const keyword = commandEles[0];

    try {

        switch (keyword) {

            case COMMAND_KEYWORDS.SET:
                ({ result, newDatabaseValue } = add(databaseValue, commandEles[1], commandEles[2]));
                break;
    
            case COMMAND_KEYWORDS.GET:
                ({ result, newDatabaseValue } = getString(databaseValue, commandEles[1]));
                break;
    
            case COMMAND_KEYWORDS.SADD:
                ({ result, newDatabaseValue } = add(databaseValue, commandEles[1], commandEles.slice(2)));
                break;
    
            case COMMAND_KEYWORDS.SREM:
                ({ result, newDatabaseValue } = deleteFromSet(databaseValue, commandEles[1], commandEles.slice(2)));
                break;
    
            case COMMAND_KEYWORDS.SMEMBERS:
                ({ result, newDatabaseValue } = getSet(databaseValue, commandEles[1]));
                break;
    
            default:
                {}
        }

    } catch {}

    return {
        result,
        newDatabaseValue,
    }
};

export default processCommand;