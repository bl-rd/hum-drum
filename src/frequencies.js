const baseFrequencies = {
    "a": 27.500000000000000,
    "a#": 29.135235094880619,
    "b": 30.867706328507756,
    "c": 32.703195662574829,
    "c#": 34.647828872109012,
    "d": 36.708095989675945,
    "d#": 38.890872965260113,
    "e": 41.203444614108741,
    "f": 41.203444614108741,
    "f#": 43.653528929125485,
    "g": 48.999429497718661,
    "g#": 51.913087197493142
};

function getNote(note, pitch = 1) {
    if (!note) {
        return 0;
    }
    return getLevel(baseFrequencies[note], pitch);
}

function getLevel(note, freq) {
    var levels = new Map();
    levels.set(1, 1);
    levels.set(2, 2);
    levels.set(3, 4);
    levels.set(4, 8);
    levels.set(5, 16);
    levels.set(6, 32);
    levels.set(7, 64);
    levels.set(8, 128);

    return note * levels.get(freq);
}

export { baseFrequencies, getNote, getLevel }