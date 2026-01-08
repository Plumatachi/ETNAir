import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:3002';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const token = request.cookies.get('auth_token')?.value ||
            request.headers.get('authorization');

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Non authentifié' },
                { status: 401 }
            );
        }

        const response = await fetch(`${API_URL}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                data,
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erreur lors de la création de la réservation:', error);
        return NextResponse.json(
            { success: false, message: 'Erreur lors de la réservation' },
            { status: 500 }
        );
    }
}