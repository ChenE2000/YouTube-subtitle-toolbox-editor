
// convert time(s) to hh:mm:ss.ms

export function formatTime(time: number): string {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = Math.floor(time - hours * 3600 - minutes * 60);
    const milliseconds = Math.floor((time - Math.floor(time)) * 1000);
    // add zero padding
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');
    const millisecondsStr = milliseconds.toString().padStart(3, '0');
    return `${hoursStr}:${minutesStr}:${secondsStr}.${millisecondsStr}`;
    }