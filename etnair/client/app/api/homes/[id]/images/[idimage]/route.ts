import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL;

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string; idimage: string }> }
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

        console.log('DELETE /api/homes/[id]/images/[idimage]');
        console.log('Home ID:', params.id);
        console.log('Image ID:', params.idimage);

        const response = await fetch(
            `${API_URL}/api/homes/${params.id}/images/${params.idimage}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression de l\'image' },
            { status: 500 }
        );
    }
}