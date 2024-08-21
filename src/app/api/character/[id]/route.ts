import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import axios from 'axios';

const publicKey = process.env.MARVEL_PUBLIC_KEY;
const privateKey = process.env.MARVEL_PRIVATE_KEY;

if (!publicKey || !privateKey) {
  throw new Error('Missing MARVEL_PUBLIC_KEY or MARVEL_PRIVATE_KEY environment variables');
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ message: 'Bad Request: Missing id parameter' }, { status: 400 });
  }

  const ts = new Date().getTime();
  const hash = crypto.createHash('md5').update(ts + privateKey! + publicKey!).digest('hex');

  const comicsUrl = `https://gateway.marvel.com:443/v1/public/characters/${id}/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=10`;
  const url = `https://gateway.marvel.com:443/v1/public/characters/${id}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

  try {
    const response = await axios.get(url);

    if (response.data.data.results.length === 0) {
      console.log("Character not found for ID:", id);
      return NextResponse.json({ message: 'Character not found' }, { status: 404 });
    }
    const characterData = response.data.data.results[0];

    const comicsResponse = await axios.get(comicsUrl);

    const comicsData = comicsResponse.data.data.results.map((comic: any) => {
      const onsaleDate = comic.dates.find((date: any) => date.type === 'onsaleDate');
      return {
        id: comic.id,
        title: comic.title,
        year: onsaleDate ? new Date(onsaleDate.date).getFullYear() : 'Unknown',
        thumbnail: comic.thumbnail,
      };
    });

    return NextResponse.json({
      id: characterData.id,
      name: characterData.name,
      description: characterData.description || 'Este super héroe no tiene descripción',
      thumbnail: characterData.thumbnail,
      comics: comicsData,
    });

  } catch (error) {
    /* console.error('Error fetching character:', error?.message, error.response?.data); */
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
