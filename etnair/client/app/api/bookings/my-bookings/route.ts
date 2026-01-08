import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:3002';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = request.cookies.get('auth_token')?.value ||
            request.headers.get('authorization');

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Non authentifié' },
                { status: 401 }
            );
        }

        const queryString = searchParams.toString();
        const url = `${API_URL}/api/bookings/my-bookings${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
            },
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
        console.error('Erreur lors de la récupération des réservations:', error);
        return NextResponse.json(
            { success: false, message: 'Erreur lors de la récupération' },
            { status: 500 }
        );
    }
}