export const generateHashName = (ip, port) => {
    const hash = `${ip}:${port}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `User-${hash}`;
};
