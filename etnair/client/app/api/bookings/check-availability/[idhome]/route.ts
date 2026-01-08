import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:3002';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ idhome: string }> }
) {
    try {
        const resolvedParams = await params;
        const { idhome } = resolvedParams;
        const { searchParams } = new URL(request.url);
        const startdate = searchParams.get('startdate');
        const enddate = searchParams.get('enddate');

        if (!idhome) {
            return NextResponse.json(
                { success: false, message: 'ID de la maison manquant' },
                { status: 400 }
            );
        }

        if (!startdate || !enddate) {
            return NextResponse.json(
                { success: false, message: 'Dates manquantes' },
                { status: 400 }
            );
        }

        const backendUrl = `${API_URL}/api/bookings/check-availability/${idhome}?startdate=${startdate}&enddate=${enddate}`;
        console.log('Calling backend:', backendUrl);

        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
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
        console.error('Erreur lors de la vérification de disponibilité:', error);
        return NextResponse.json(
            { success: false, message: 'Erreur lors de la vérification' },
            { status: 500 }
        );
    }
}