import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import { SearchBox } from "./components/SearchBox";
import { ImageList, Image } from "./components/ImageList";
import styled from "styled-components"; // css-in-js

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

const SearchBar = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  position: fixed;
  height: 60px;
  background: rgba(0, 0, 0, 0.25);
`;

const BottomWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const App: React.FC = () => {
  const [keywords, setKeywords] = useState("");
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
    if (keywords) {
      // Always navigate to page 1 if keywords updated
      debouncedSearch.current(keywords, 1);
    } else {
      // Reset search results
      setImages([]);
    }
  }, [keywords]);

  return (
    <div>
      <SearchBar>
        <SearchBox onSearch={(v) => setKeywords(v)} />
      </SearchBar>
      {!!images.length ? (
        <>
          <ImageList images={images} />
          <BottomWrapper>{hasMore ? (
            <button
              onClick={() => {
                setPage((prePage) => prePage + 1);
                fetchImages(keywords, page); // fetch more
              }}
            >
              View more
            </button>
          ) : (
            <div>End of search results</div>
          )}</BottomWrapper>
        </>
      ) : loading ? (
        "Loading..."
      ) : null}
    </div>
  );
};

export default App;
