import default_images_urls from "./default_images.js";

/**
 * * Return #number images
 * @param api_key {string} The service API key. If unset, default images are used.
 * @return {[{"url": string, "key": string}]}
 */
async function fetchImages(number=24, api_key="") {
  let updated_urls = [];
  if (api_key !== "") {
    const page = Math.round(Math.random() * 10);
    const perpage = 50;
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${api_key}&group_id=1422009%40N23&per_page=${perpage}&page=${page}&format=json&nojsoncallback=1`;

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
  } else {
    updated_urls = default_images_urls.slice(0, number);
  }

  return updated_urls;
}

export default fetchImages;
