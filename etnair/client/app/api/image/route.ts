import { NextRequest, NextResponse } from 'next/server';
import { minioClient, MINIO_BUCKET } from '@/lib/minio';

export async function GET(request: NextRequest) {
    try {
        const imageKey = request.nextUrl.searchParams.get('key');

        if (!imageKey) {
            return NextResponse.json({ error: 'Image key manquante' }, { status: 400 });
        }

        const dataStream = await minioClient.getObject(MINIO_BUCKET, imageKey);

        const chunks: Buffer[] = [];
        for await (const chunk of dataStream) {
            chunks.push(chunk);
        }
        const imageBuffer = Buffer.concat(chunks);

        const extension = imageKey.split('.').pop()?.toLowerCase();
        const contentType =
            extension === 'png' ? 'image/png' :
                extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' :
                    extension === 'webp' ? 'image/webp' :
                        'image/jpeg';

        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Erreur Minio:', error);
        return NextResponse.json({
            error: 'Image non trouvée'
        }, { status: 404 });
    }
}