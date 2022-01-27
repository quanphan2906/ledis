import { COMMAND_KEYWORDS, RESULT } from "./const";


const database = {}


const add = (key, value) => {
    if ( Array.isArray(value) ) {
        value = new Set(value);
    }

    database[key] = value;

    return RESULT.SUCCESS;
}


const getString = (key) => {
    if ( key in database && typeof database[key] !== "object" ) {

        return database[key];
    } else throw RESULT.ERROR;
}


const deleteFromSet = (key, values) => {
    if ( key in database ) {

        for (let value of values) {
            database[key] = database[key].delete(value);
        }

        return database[key];
    } else throw RESULT.ERROR;
}


const getSet = (key) => {
    if ( key in database & typeof database[key] == "object" ) {

        return Array.from(database[key]);
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
    
            default:
                {}
        }

    } catch {}

    return result;
};

export { processCommand };