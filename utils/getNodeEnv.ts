export const getNodeEnv = () => {
    const env = process.env.NODE_ENV;
    if (!env) {
        throw new Error("NODE_ENV not set in environment variables");
    }
    return env;
};
