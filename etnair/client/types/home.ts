export enum PropertyType {
    APARTMENT = 'APARTMENT',
    HOUSE = 'HOUSE',
    STUDIO = 'STUDIO',
    VILLA = 'VILLA',
    COTTAGE = 'COTTAGE',
    LOFT = 'LOFT',
    CHALET = 'CHALET',
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
    [PropertyType.APARTMENT]: 'Appartement',
    [PropertyType.HOUSE]: 'Maison',
    [PropertyType.STUDIO]: 'Studio',
    [PropertyType.VILLA]: 'Villa',
    [PropertyType.COTTAGE]: 'Cottage',
    [PropertyType.LOFT]: 'Loft',
    [PropertyType.CHALET]: 'Chalet',
};

export interface HomeImage {
    idimage: string;
    idhome: string;
    imageurl: string;
    imagekey: string;
    ordernum: number;
}

export interface Home {
    idhome: string;
    namehome: string;
    description: string;
    price: number;
    address: string;
    city: string;
    postalcode: string;
    country: string;
    iduser: string;
    propertytype: PropertyType;
    home_image: HomeImage[];
}

export function getPropertyTypeLabel(type: PropertyType): string {
    return PROPERTY_TYPE_LABELS[type] || type;
}

export function getImageUrl(imageKey: string | null): string | null {
    console.log('🔍 getImageUrl appelée avec:', { imageKey, type: typeof imageKey });
    if (!imageKey) return null;
    const url = `/api/images/${imageKey}`;
    console.log('🔗 URL construite:', url);
    return url;
}

export function getFirstImageKey(home: Home): string | null {
    if (!home.home_image || home.home_image.length === 0) {
        return null;
    }

    const sortedImages = [...home.home_image].sort((a, b) => a.ordernum - b.ordernum);
    return sortedImages[0].imagekey;
}