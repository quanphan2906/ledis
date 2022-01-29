import { COMMAND_KEYWORDS, RESULT } from "./const";
import { cloneDeep, isEmpty } from "lodash";


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

    return RESULT.OK;
}


const getString = (key) => {

    if (key == null) {
        return RESULT.INVALID_USAGE;
    }

    if ( !(key in database) || typeof database[key].value === "object" ) {
        return RESULT.KEY_ERROR;
    }

    return database[key].value;
}


const addSet = (key, values) => {
    
    if (key == null || values.length == 0) {
        return RESULT.INVALID_USAGE;
    }

    const newSet = new Set(values);

    if ( key in database ) {

        if ( typeof database[key].value !== "object" ) {
            return RESULT.NOT_SET;
        }


        const oldSet = database[key].value;
        oldSet.forEach(newSet.add, newSet);
        database[key].value = newSet;

        return newSet.size - oldSet.size;
    }

    database[key] = {
        timeOut: null,
        value: newSet,
    };

    return newSet.size;
}


const deleteFromSet = (key, values) => {
    if (key == null) {
        return RESULT.INVALID_USAGE;
    }

    if ( !(key in database) ) {
        return 0;
    }

    const oldSetSize = database[key].value.size;

    for (let value of values) {
        database[key].value.delete(value);
    }
    
    const newSetSize = database[key].value.size;

    return oldSetSize - newSetSize;
}


const getSet = (key) => {

    if ( key == null ) {
        return RESULT.INVALID_USAGE;
    }

    if ( !(key in database) || typeof database[key].value !== "object" ) {
        return RESULT.KEY_ERROR;
    }

    return Array.from(database[key].value);
}


const setIntersect = (keys) => {

    let intersection = new Set([]);

    for (let key of keys) {

        if ( key in database && typeof database[key].value === "object" ) {

            let set = database[key].value;

            if (intersection.size == 0) {
                intersection = set;
            } else {

                intersection = new Set([...intersection].filter(i => set.has(i)));
            }
        } else {

            return [];
        }
    }

    return Array.from(intersection);
}


const getKeys = () => {

    return Array.from(Object.keys(database));
}


const deleteKey = (key) => {

    if ( !(key in database) ) {
        return RESULT.KEY_ERROR;
    }

    delete database[key];
    return RESULT.OK;    
}


const getExpirationTime = (key) => {

    if ( !(key in database) ) {
        return RESULT.KEY_ERROR;
    }

    return database[key].timeOut === null ? ('None') : database[key].timeOut;
}


const setExpire = (key, time) => {

    if ( !(key in database) ) {
        return RESULT.KEY_ERROR;
    }

    const timeInt = parseInt(time, 10);

    if ( isNaN(timeInt) ) {
        return RESULT.INVALID_USAGE;
    }

    if ( key in database ) {

        database[key].timeOut = timeInt;
        
        setTimeout(() => deleteKey(key), timeInt * 1000);

        return timeInt;
    }
}


const saveSnapshot = () => {
    snapshot = cloneDeep(database);
    return RESULT.OK;
}


const restore = () => {
    
    if ( isEmpty(snapshot) ) {
        return RESULT.EMPTY_SNAPSHOT;
    }

    database = cloneDeep(snapshot);
    snapshot = {};
    return RESULT.OK;
}


const reset = () => {
    database = {};
    snapshot = {};
    return RESULT.OK;
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