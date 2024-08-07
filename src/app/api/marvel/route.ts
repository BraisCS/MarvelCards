import { NextResponse } from 'next/server';
import md5 from 'md5';

const cache = new Map<string, any>();

export async function GET() {
    const publicKey = process.env.MARVEL_PUBLIC_KEY as string;
    const privateKey = process.env.MARVEL_PRIVATE_KEY as string;

    if (!publicKey || !privateKey) {
        return NextResponse.json({ message: 'API keys are not configured properly' }, { status: 500 });
    }

    const ts = new Date().getTime();
    const hash = md5(ts + privateKey + publicKey);
    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=50`;

    if (cache.has(url)) {
        return NextResponse.json({ characters: cache.get(url) });
    }

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
        const characters = data.data.results.map((character: any) => ({
            id: character.id,
            name: character.name,
            thumbnail: {
                path: character.thumbnail.path,
                extension: character.thumbnail.extension,
            }
        }));

        cache.set(url, characters);
        return NextResponse.json({ characters });

    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
