export const generatePrice = (id: number): number => {
    const seed = id * 137.5;
    return parseFloat((10 + (seed % 90)).toFixed(2));
};
