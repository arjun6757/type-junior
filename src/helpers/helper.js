export function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

export function calculateWPM(numberOfWords, timetaken) {
    const words = numberOfWords.length;
    const wpm = Math.round((words / timetaken) * 60);
    return wpm;
}