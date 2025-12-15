const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

class S3Service {
    constructor() {
        this.client = new S3Client({
            endpoint: process.env.MINIO_ENDPOINT,
            region: process.env.MINIO_REGION,
            credentials: {
                accessKeyId: process.env.MINIO_ACCESS_KEY,
                secretAccessKey: process.env.MINIO_SECRET_KEY,
            },
            forcePathStyle: true,
        });

        this.bucket = process.env.MINIO_BUCKET;
    }

    async uploadHomeImage(idhome, fileBuffer, originalName, mimeType, ordernum = 0) {
        try {
            const idimage = uuidv4();
            const ext = this.getExtension(originalName, mimeType);

            const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');

            // Structure: annonces/id-annonce/nom-fichier.extension
            const imagekey = `annonces/${idhome}/${nameWithoutExt}${ext}`;

            const optimizedBuffer = await sharp(fileBuffer)
                .resize(1920, 1080, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({ quality: 85 })
                .toBuffer();

            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: imagekey,
                Body: optimizedBuffer,
                ContentType: mimeType,
                Metadata: {
                    'original-name': originalName,
                    'home-id': idhome,
                    'image-id': idimage,
                },
            });

            await this.client.send(command);

            // URL complète: http://localhost:9000/etnair/annonces/id-annonce/image.png
            const imageurl = `${process.env.MINIO_ENDPOINT}/${this.bucket}/${imagekey}`;

            return {
                idimage,
                imageurl,
                imagekey,
                ordernum,
            };
        } catch (error) {
            console.error('Erreur lors de l\'upload de l\'image:', error);
            throw new Error(`Impossible d'uploader l'image: ${error.message}`);
        }
    }

    async uploadMultipleHomeImages(idhome, files) {
        const uploadPromises = files.map((file, index) =>
            this.uploadHomeImage(
                idhome,
                file.buffer,
                file.originalName,
                file.mimeType,
                index
            )
        );

        return await Promise.all(uploadPromises);
    }

    async getSignedImageUrl(imagekey, expiresIn = 3600) {
        try {
            const command = new GetObjectCommand({
                Bucket: this.bucket,
                Key: imagekey,
            });

            const url = await getSignedUrl(this.client, command, { expiresIn });
            return url;
        } catch (error) {
            console.error('Erreur lors de la génération de l\'URL signée:', error);
            throw new Error(`Impossible de générer l'URL: ${error.message}`);
        }
    }

    async deleteHomeImage(imagekey) {
        try {
            const command = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: imagekey,
            });

            await this.client.send(command);
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'image:', error);
            throw new Error(`Impossible de supprimer l'image: ${error.message}`);
        }
    }

    async deleteAllHomeImages(idhome) {
        try {
            const prefix = `annonces/${idhome}/`;

            const listCommand = new ListObjectsV2Command({
                Bucket: this.bucket,
                Prefix: prefix,
            });

            const { Contents } = await this.client.send(listCommand);

            if (!Contents || Contents.length === 0) {
                return { deleted: 0 };
            }

            const deleteCommand = new DeleteObjectsCommand({
                Bucket: this.bucket,
                Delete: {
                    Objects: Contents.map(({ Key }) => ({ Key })),
                    Quiet: false,
                },
            });

            const result = await this.client.send(deleteCommand);
            return {
                deleted: result.Deleted?.length || 0,
                errors: result.Errors || []
            };
        } catch (error) {
            console.error('Erreur lors de la suppression des images:', error);
            throw new Error(`Impossible de supprimer les images: ${error.message}`);
        }
    }

    async listHomeImages(idhome) {
        try {
            const prefix = `annonces/${idhome}/`;

            const command = new ListObjectsV2Command({
                Bucket: this.bucket,
                Prefix: prefix,
            });

            const { Contents } = await this.client.send(command);

            if (!Contents) return [];

            return Contents.map(item => ({
                key: item.Key,
                size: item.Size,
                lastModified: item.LastModified,
                url: `${process.env.MINIO_ENDPOINT}/${this.bucket}/${item.Key}`
            }));
        } catch (error) {
            console.error('Erreur lors de la liste des images:', error);
            throw new Error(`Impossible de lister les images: ${error.message}`);
        }
    }

    getExtension(filename, mimeType) {
        const extFromName = filename.split('.').pop();
        if (extFromName && extFromName.length <= 4) {
            return `.${extFromName}`;
        }

        const mimeToExt = {
            'image/jpeg': '.jpg',
            'image/jpg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif',
            'image/webp': '.webp',
        };

        return mimeToExt[mimeType] || '.jpg';
    }

    async ensureBucketExists() {
        const { HeadBucketCommand, CreateBucketCommand } = require('@aws-sdk/client-s3');

        try {
            await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
            console.log(`Bucket ${this.bucket} existe déjà`);
        } catch (error) {
            if (error.name === 'NotFound') {
                await this.client.send(new CreateBucketCommand({ Bucket: this.bucket }));
                console.log(`Bucket ${this.bucket} créé avec succès`);
            } else {
                throw error;
            }
        }
    }
}

module.exports = new S3Service();