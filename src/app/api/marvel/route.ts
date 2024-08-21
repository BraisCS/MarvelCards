import { NextResponse } from 'next/server';
import md5 from 'md5';

export async function GET() {
    const publicKey = process.env.MARVEL_PUBLIC_KEY as string;
    const privateKey = process.env.MARVEL_PRIVATE_KEY as string;

    if (!publicKey || !privateKey) {
        return NextResponse.json({ message: 'API keys are not configured properly' }, { status: 500 });
    }

    const ts = new Date().getTime();
    const hash = md5(ts + privateKey + publicKey);
    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=18`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            console.error('Error response:', response.statusText, await response.text());
            return NextResponse.json({ message: 'Error fetching data' }, { status: response.status });
        }

        const data = await response.json();

        // Aquí directamente construyes un nuevo objeto con los campos deseados y los envías como respuesta
        return NextResponse.json({
            characters: data.data.results.map((character: any) => ({
                id: character.id,
                name: character.name,
                thumbnail: {
                    path: character.thumbnail.path,
                    extension: character.thumbnail.extension,
                }
            }))
        });

    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
