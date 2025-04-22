
export function generateInviteCode(
    length: number = 5,
    frontChars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    backChars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
): string {
    let front = '';
    for (let i = 0; i < length; i++) {
        front += frontChars.charAt(Math.floor(Math.random() * frontChars.length));
    }

    let back = '';
    for (let i = 0; i < length; i++) {
        back += backChars.charAt(Math.floor(Math.random() * backChars.length));
    }

    return `${front}${back}`;
}

// const invite = generateInviteCode(); // e.g., "Z3F8T1K2"

