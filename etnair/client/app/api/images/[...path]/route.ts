import { NextRequest, NextResponse } from 'next/server';
import * as Minio from 'minio';

export const dynamic = 'force-dynamic';

const getMinioClient = () => {
    const endpoint = process.env.MINIO_ENDPOINT || 'http://localhost:9001';
    const accessKey = process.env.MINIO_ACCESS_KEY || 'minioadmin';
    const secretKey = process.env.MINIO_SECRET_KEY || 'minioadmin';

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
    console.log('🔵 ========================================');
    console.log('🔵 API ROUTE /api/images/[...path] APPELÉE');
    console.log('🔵 ========================================');

    try {
        const params = await context.params;
        console.log('📦 Params reçus:', JSON.stringify(params, null, 2));

        if (!params.path || params.path.length === 0) {
            console.log('❌ Pas de path dans les params');
            return NextResponse.json(
                { error: 'Chemin d\'image manquant' },
                { status: 400 }
            );
        }

        const imagePath = params.path.join('/');
        const bucket = process.env.MINIO_BUCKET || 'etnair';

        console.log('📁 Bucket:', bucket);
        console.log('📁 Chemin image:', imagePath);

        // Créer le client MinIO
        const minioClient = getMinioClient();

        // Vérifier si l'objet existe
        console.log('🔍 Vérification existence de l\'objet...');
        try {
            const stat = await minioClient.statObject(bucket, imagePath);
            console.log('✅ Objet trouvé:', {
                size: stat.size,
                etag: stat.etag,
                lastModified: stat.lastModified,
            });
        } catch (error) {
            console.error('❌ Objet non trouvé dans MinIO:', error);
            return NextResponse.json(
                {
                    error: 'Image non trouvée',
                    bucket,
                    path: imagePath,
                },
                { status: 404 }
            );
        }

        // Récupérer l'objet
        console.log('📥 Récupération de l\'objet depuis MinIO...');
        const dataStream = await minioClient.getObject(bucket, imagePath);

        // Convertir le stream en buffer
        console.log('🔄 Conversion du stream en buffer...');
        const chunks: Buffer[] = [];
        for await (const chunk of dataStream) {
            chunks.push(Buffer.from(chunk));
        }
        const imageBuffer = Buffer.concat(chunks);
        console.log(`✅ Buffer créé: ${imageBuffer.length} bytes`);

        // Déterminer le Content-Type
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
        console.log(`📝 Content-Type: ${contentType}`);

        console.log('✅ Envoi de l\'image au client');
        console.log('🔵 ========================================');

        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Content-Length': imageBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error('💥 ========================================');
        console.error('💥 ERREUR CRITIQUE dans API Route');
        console.error('💥 ========================================');
        console.error('💥 Type:', error instanceof Error ? error.constructor.name : typeof error);
        console.error('💥 Message:', error instanceof Error ? error.message : String(error));
        console.error('💥 Stack:', error instanceof Error ? error.stack : 'Pas de stack trace');

        return NextResponse.json(
            {
                error: 'Erreur serveur lors de la récupération de l\'image',
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}