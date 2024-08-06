import { NextResponse } from 'next/server';
import md5 from 'md5';
import axios from 'axios';

export async function GET() {
    const publicKey = process.env.MARVEL_PUBLIC_KEY as string;
    const privateKey = process.env.MARVEL_PRIVATE_KEY as string;

    if (!publicKey || !privateKey) {
        return NextResponse.json({ message: 'API keys are not configured properly' }, { status: 500 });
    }
    const ts = new Date().getTime();
    const hash = md5(ts + privateKey + publicKey);

    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=5`;

    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            const characters = response.data.data.results.map((character: any) => ({
                id: character.id,
                name: character.name,
                thumbnail: {
                    path: character.thumbnail.path,
                    extension: character.thumbnail.extension,
                }
            }));
            
            return NextResponse.json({ characters });
        } else {
            console.error('Error response:', response);
            return NextResponse.json({ message: 'Error fetching data' }, { status: response.status });
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
