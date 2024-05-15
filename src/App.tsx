import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import { SearchBox } from "./components/SearchBox";
import { ImageList, Image } from "./components/ImageList";
import styled from "styled-components";

const API_KEY = "3e7cc266ae2b0e0d78e279ce8e361736";

interface Result {
  page: number;
  pages: number;
  perpage: number;
  photo: Photo[];
  total: number;
}

interface Photo {
  farm: number;
  server: string;
  secret: string;
  id: string;
}

const Container = styled.div`
  
`;

const App: React.FC = () => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<Image[]>([]);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchImages = async (text: string, pageNum: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${API_KEY}&format=json&nojsoncallback=1&safe_search=1&text=${text}&page=${pageNum}`
      );
      const photos: Result = response.data.photos;
      console.log(photos, photos.photo);
      const newImages = [
        ...images,
        ...photos.photo.map((photo) => ({
          id: photo.id,
          url: `http://farm${photo.farm}.static.flickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`,
        })),
      ];
      setImages(newImages);
      setHasMore(photos.pages > pageNum);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useRef(
    debounce(fetchImages, 500, {
      trailing: true,
      leading: false,
    })
  );

  useEffect(() => {
    if (query) {
      debouncedSearch.current(query, page);
    }
  }, [query]);

  // TODO: fetch more

  return (
    <div>
      <div >
        <SearchBox onSearch={(v) => setQuery(v)} />
      </div>
      {loading ? "Loading..." : <ImageList images={images} />}
    </div>
  );
};

export default App;
