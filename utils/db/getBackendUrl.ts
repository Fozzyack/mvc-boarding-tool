
/*
 * Was planning on using another backend however, may have settled on just using nextjs
 */

const getBackendUrl = () => {
    const url = process.env.BACKEND_URL;
    if (!url) {
        return ""
    }
    return url;
}
export default getBackendUrl;
