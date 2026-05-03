export function getUserInitialsFromFullName(fullName: string) {
    const initials = fullName.split(' ').map((n) => n[0]);
    return initials.length >= 2
        ? `${initials[1]}${initials[0]}`.toUpperCase()
        : initials.length == 1
          ? `${initials[0]}`.toUpperCase()
          : '';
}
