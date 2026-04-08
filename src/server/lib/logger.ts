import pino from "pino";

const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
    // In Next.js, transport for pino-pretty often fails in dev/standalone mode.
    // We'll use a simpler setup or default to standard pino logs.
    base: undefined, // Remove pid and hostname for cleaner logs
});

export const logBuffer: any[] = [];
const MAX_BUFFER_SIZE = 100;

function addToBuffer(level: string, msg: string, obj?: any) {
    logBuffer.push({
        timestamp: new Date().toISOString(),
        level,
        message: msg,
        data: obj,
    });
    if (logBuffer.length > MAX_BUFFER_SIZE) {
        logBuffer.shift();
    }
}

export const log = {
    info: (msg: string, obj?: any) => {
        addToBuffer("info", msg, obj);
        if (obj) logger.info(obj, msg);
        else logger.info(msg);
    },
    error: (msg: string, obj?: any) => {
        addToBuffer("error", msg, obj);
        if (obj) logger.error(obj, msg);
        else logger.error(msg);
    },
    warn: (msg: string, obj?: any) => {
        addToBuffer("warn", msg, obj);
        if (obj) logger.warn(obj, msg);
        else logger.warn(msg);
    },
    debug: (msg: string, obj?: any) => {
        addToBuffer("debug", msg, obj);
        if (obj) logger.debug(obj, msg);
        else logger.debug(msg);
    },
};

export default log;
