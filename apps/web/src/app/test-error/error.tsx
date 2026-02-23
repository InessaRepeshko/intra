'use client';

import { useEffect } from "react";

export default function TestErrorPage() {
    useEffect(() => {
        // Помилка виникне після завантаження на клієнті
        throw new Error("Client-side error test");
    }, []);

    return <div>Loading error test...</div>;
}