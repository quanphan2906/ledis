import { COMMAND_KEYWORDS, RESULT } from "./const";
import { cloneDeep } from "lodash";


var database = {};
var snapshot = {};


const addString = (key, value) => {

    if ( key == null || value == null ) {
        return RESULT.INVALID_USAGE;
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
    } else throw (key == null) ? RESULT.INVALID_USAGE : RESULT.KEY_ERROR;
}


const addSet = (key, values) => {
    if ( key in database && values.length != 0 ) {
        
        const newSet = new Set(values);

        if (typeof database[key].value !== "object") {

            database[key] = {
                timeOut: null,
                value: newSet,
            }
            
        } else {

            const oldSet = database[key].value;
            oldSet.forEach(newSet.add, newSet);
            database[key].value = newSet;
        }

        return RESULT.SUCCESS;

    } else {

        if (key == null) {
            throw RESULT.KEY_ERROR;
        }

        if (values.length == 0) {
            throw RESULT.INVALID_USAGE;
        }

    };
}


const deleteFromSet = (key, values) => {
    if ( key in database ) {

        for (let value of values) {
            database[key].value.delete(value);
        }

        return Array.from(database[key].value);
    } else throw RESULT.KEY_ERROR;
}


const getSet = (key) => {
    if ( key in database & typeof database[key].value === "object" ) {

        return Array.from(database[key].value);
    } else throw RESULT.KEY_ERROR;
}


const setIntersect = (keys) => {

    let intersection = new Set([]);

    for (let key of keys) {

        if ( key in database && typeof database[key].value === "object" ) {

            let set = database[key].value;

            if (intersection.size === 0) {

                intersection = set;
            } else {

                intersection = new Set([...intersection].filter(i => set.has(i)));
            }
        }
    }

    return Array.from(intersection);
}


const getKeys = () => {

    return Array.from(Object.keys(database));
}


const deleteKey = (key) => {
    if ( key in database ) {

        delete database[key];
        return RESULT.SUCCESS;

    } else throw RESULT.KEY_ERROR;
}


const getExpirationTime = (key) => {
    if ( key in database ) {

        return database[key].timeOut === null ? ('None') : database[key].timeOut;
    } else throw RESULT.KEY_ERROR;
}


const setExpire = (key, time) => {
    if ( key in database ) {

        database[key].timeOut = time;
        
        setTimeout(() => deleteKey(time), time);

        return RESULT.SUCCESS; 
    } else throw RESULT.KEY_ERROR;
}


const saveSnapshot = () => {
    snapshot = cloneDeep(database);
    return RESULT.SUCCESS;
}


const restore = () => {
    database = cloneDeep(snapshot);
    snapshot = {};
    return RESULT.SUCCESS;
}


const reset = () => {
    database = {};
    snapshot = {};
    return RESULT.SUCCESS;
}


const processCommand = (command) => {

    let result = RESULT.KEY_ERROR;

    const commandEles = command.trim().replace(/\s+/g, " ").split(" ");
    const keyword = commandEles[0];

    try {

        switch (keyword) {

            case COMMAND_KEYWORDS.SET:
                result = addString(commandEles[1], commandEles[2]);
                break;
    
            case COMMAND_KEYWORDS.GET:
                result = getString(commandEles[1]);
                break;
    
            case COMMAND_KEYWORDS.SADD:
                result = addSet(commandEles[1], commandEles.slice(2));
                break;
    
            case COMMAND_KEYWORDS.SREM:
                result = deleteFromSet(commandEles[1], commandEles.slice(2));
                break;
    
            case COMMAND_KEYWORDS.SMEMBERS:
                result = getSet(commandEles[1]);
                break;

            case COMMAND_KEYWORDS.SINTER:
                result = setIntersect(commandEles.slice(1));
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
                result = getExpirationTime(commandEles[1]);
                break;

            case COMMAND_KEYWORDS.SAVE:
                result = saveSnapshot();
                break;

            case COMMAND_KEYWORDS.RESTORE:
                result = restore();
                break;

            case COMMAND_KEYWORDS.RESET:
                result = reset();
                break;
    
            default:
                result = RESULT.COMMAND_ERROR;
        }

    } catch (e) {
        result = e;
    }

    return result;
};

export { processCommand };