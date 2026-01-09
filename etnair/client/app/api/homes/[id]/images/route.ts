import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const params = await context.params;
    try {
        const token = request.headers.get('authorization');

        if (!token) {
            return NextResponse.json(
                { error: 'Non authentifié' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        console.log('POST /api/homes/[id]/images - ID:', params.id);

        const response = await fetch(`${API_URL}/api/homes/${params.id}/images`, {
            method: 'POST',
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erreur lors de l\'ajout des images:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'ajout des images' },
            { status: 500 }
        );
    }
}