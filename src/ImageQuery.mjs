/**
 * Return #number images
 * @return {[{"url": string, "key": string}]}
 */
async function fetchImages(number) {
  console.log("Fetching ", number);
  const page = Math.round(Math.random() * 10);
  const perpage = 50;
  const FLICKR_API = process.env.LYNX_FLICKR_API_KEY;
  const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${FLICKR_API}&group_id=1422009%40N23&per_page=${perpage}&page=${page}&format=json&nojsoncallback=1`;
  let updated_urls = [];

  try {
    const resp = await fetch(url);
    const data = await resp.json();
    if (!("photos" in data)) {
      console.log("Error: no photos: ", data);
      return [];
    }
    const photo_array = data.photos.photo.sort(() => 0.5 - Math.random()).slice(0, number);
    updated_urls = photo_array.map(el => {
      return {
        "url": `https://live.staticflickr.com/${el.server}/${el.id}_${el.secret}_q.jpg`,
        "key": el.id
      };
    });
  } catch (error) {
    console.log("Exception while fetching resources: ", error);
  }

  return updated_urls;
}

export default fetchImages;
