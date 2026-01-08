import {NextRequest, NextResponse} from 'next/server';

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

export async function POST(request: NextRequest) {
    try {
        const token = request.headers.get('authorization');

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Non authentifié' },
                { status: 401 }
            );
        }

        const formData = await request.formData();

        console.log('FormData reçu côté Next.js:');
        for (const [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: ${value.name} (${value.size} bytes)`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }

        const backendFormData = new FormData();
        for (const [key, value] of formData.entries()) {
            if (key === 'propertytype') {
                backendFormData.append('propertyType', value as string);
            } else {
                backendFormData.append(key, value);
            }
        }

        console.log('FormData envoyé au backend:');
        for (const [key, value] of backendFormData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: ${value.name} (${value.size} bytes)`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }

        console.log('Envoi vers:', `${API_URL}/api/home`);

        const response = await fetch(`${API_URL}/api/home`, {
            method: 'POST',
            headers: {
                'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
            },
            body: backendFormData,
        });

        console.log('Statut de la réponse backend:', response.status);

        const data = await response.json();
        console.log('Réponse backend:', data);

        if (!response.ok) {
            return NextResponse.json(
                data,
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Erreur détaillée lors de la création du bien:', error);
        return NextResponse.json(
            { success: false, message: 'Erreur lors de la création du bien', error: String(error) },
            { status: 500 }
        );
    }
}