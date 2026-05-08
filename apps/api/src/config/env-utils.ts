<<<<<<< HEAD
export function validateEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}.
             Expected file: .env.development.local (see package.json scripts).
             Expected format: <VARIABLE_NAME>=<VALUE>`);
    }
    return value;
}

export function getEnvVarAsStr(name: string): string {
    return String(validateEnvVar(name));
}

export function getEnvVarAsInt(name: string): number {
    return parseInt(validateEnvVar(name));
}
=======
export function validateEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}.
             Expected file: .env.development.local (see package.json scripts).
             Expected format: <VARIABLE_NAME>=<VALUE>`);
    }
    return value;
}

export function getEnvVarAsStr(name: string): string {
    return String(validateEnvVar(name));
}

export function getEnvVarAsInt(name: string): number {
    return parseInt(validateEnvVar(name));
}
>>>>>>> origin/main
