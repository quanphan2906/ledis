import { COMMAND_KEYWORDS, RESULT } from "./const";


const database = {}


const add = (key, value) => {
    if ( Array.isArray(value) ) {
        value = new Set(value);
    }

    database[key] = {
        timeOut: null,
        value: value,
    };

    return RESULT.SUCCESS;
}


const getString = (key) => {
    if ( key in database && typeof database[key].value !== "object" ) {

        return database[key].value;
    } else throw RESULT.ERROR;
}


const deleteFromSet = (key, values) => {
    if ( key in database ) {

        for (let value of values) {
            database[key].value.delete(value);
        }

        return Array.from(database[key].value);
    } else throw RESULT.ERROR;
}


const getSet = (key) => {
    if ( key in database & typeof database[key].value === "object" ) {

        return Array.from(database[key].value);
    } else throw RESULT.ERROR;
}


const getKeys = () => {

    return Array.from(Object.keys(database));
}


const deleteKey = (key) => {
    if ( key in database ) {

        delete database[key];
        return RESULT.SUCCESS;

    } else throw RESULT.ERROR;
}


const getExpireKey = (key) => {
    if ( key in database ) {

        return database[key].timeOut === null ? ('None') : database[key].timeOut;
    } else throw RESULT.ERROR;
}


const setExpire = (key, time) => {
    if ( key in database ) {

        database[key].timeOut = time;
        return RESULT.SUCCESS; 
    } else throw RESULT.ERROR;
}


const processCommand = (command) => {

    let result = RESULT.ERROR;

    const commandEles = command.trim().replace(/\s+/g, " ").split(" ");
    const keyword = commandEles[0];

    try {

        switch (keyword) {

            case COMMAND_KEYWORDS.SET:
                result = add(commandEles[1], commandEles[2]);
                break;
    
            case COMMAND_KEYWORDS.GET:
                result = getString(commandEles[1]);
                break;
    
            case COMMAND_KEYWORDS.SADD:
                result = add(commandEles[1], commandEles.slice(2));
                break;
    
            case COMMAND_KEYWORDS.SREM:
                result = deleteFromSet(commandEles[1], commandEles.slice(2));
                break;
    
            case COMMAND_KEYWORDS.SMEMBERS:
                result = getSet(commandEles[1]);
                break;

            case COMMAND_KEYWORDS.KEYS:
                result = getKeys();
                break;

            case COMMAND_KEYWORDS.DEL:
                result = deleteKey(commandEles[1]);
                break;

            case COMMAND_KEYWORDS.EXPIRE:
                result = setExpire(commandEles[1], commandEles[2]);
                break;

            case COMMAND_KEYWORDS.TTL:
                result = getExpireKey(commandEles[1]);
                break;
    
            default:
                result = RESULT.ERROR;
        }

    } catch {
        result = RESULT.ERROR;
    }

    return result;
};

export { processCommand };