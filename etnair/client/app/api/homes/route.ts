import { NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function GET() {
    try {
        const response = await fetch(`${API_URL}/api/homes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erreur API');
        }

        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erreur proxy:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des données' },
            { status: 500 }
        );
    }
}