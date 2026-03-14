export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function* lcgGenerator(seed) {
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 32;
    let current = seed;
    while (true) {
        current = (a * current + c) % m;
        yield current;
    }       
}   

export function* calorGenerator(colors) {
    let index = 0;
    while (true) {
        yield colors[index];
        index = (index + 1) % colors.length;
    }   
}

export function* PiNextGenerator() {
    const piDigits = "1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679";
    let index = 0;
    while (true) {
        yield piDigits[index];
        index = (index + 1) % piDigits.length;
    }
}
