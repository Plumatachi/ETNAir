import { NextRequest, NextResponse } from 'next/server';
import * as Minio from 'minio';

export const dynamic = 'force-dynamic';

// Initialiser le client MinIO
const getMinioClient = () => {
    const endpoint = process.env.MINIO_ENDPOINT || 'http://localhost:9001';
    const accessKey = process.env.MINIO_ACCESS_KEY || 'minioadmin';
    const secretKey = process.env.MINIO_SECRET_KEY || 'minioadmin';

    // Extraire host et port de l'endpoint
    const url = new URL(endpoint);
    const host = url.hostname;
    const port = parseInt(url.port || (url.protocol === 'https:' ? '443' : '80'));
    const useSSL = url.protocol === 'https:';

    console.log('🔧 Configuration MinIO Client:', { host, port, useSSL });

    return new Minio.Client({
        endPoint: host,
        port: port,
        useSSL: useSSL,
        accessKey: accessKey,
        secretKey: secretKey,
    });
};

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    try {
        const params = await context.params;

        if (!params.path || params.path.length === 0) {
            return NextResponse.json(
                { error: 'Chemin d\'image manquant' },
                { status: 400 }
            );
        }

        const imagePath = params.path.join('/');
        const bucket = process.env.MINIO_BUCKET || 'etnair';

        const minioClient = getMinioClient();

        try {
            const stat = await minioClient.statObject(bucket, imagePath);
        } catch (error) {
            console.error('Objet non trouvé dans MinIO:', error);
            return NextResponse.json(
                {
                    error: 'Image non trouvée',
                    bucket,
                    path: imagePath,
                },
                { status: 404 }
            );
        }

        const dataStream = await minioClient.getObject(bucket, imagePath);

        const chunks: Buffer[] = [];
        for await (const chunk of dataStream) {
            chunks.push(Buffer.from(chunk));
        }
        const imageBuffer = Buffer.concat(chunks);

        const extension = imagePath.split('.').pop()?.toLowerCase();
        const mimeTypes: Record<string, string> = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'webp': 'image/webp',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
        };
        const contentType = mimeTypes[extension || ''] || 'application/octet-stream';

        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Length': imageBuffer.length.toString(),
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });

    } catch (error) {
        console.error('Erreur Minio:', error);
        return NextResponse.json(
            {
                error: 'Erreur serveur lors de la récupération de l\'image',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}