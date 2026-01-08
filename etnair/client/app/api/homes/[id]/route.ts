import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:3002';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Validation UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            return NextResponse.json(
                { error: 'ID invalide' },
                { status: 400 }
            );
        }

        const response = await fetch(`${API_URL}/api/homes/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Annonce non trouvée');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Erreur proxy home:', error);
        return NextResponse.json(
            { error: 'Annonce non trouvée' },
            { status: 404 }
        );
    }
}