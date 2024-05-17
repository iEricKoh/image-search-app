import React from "react";
import styled from "styled-components";

export interface Image {
  url: string;
  id: string;
}

interface ImageListProps {
  images: Image[];
}

const List = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(25vw, 1fr));
`;

const Image = styled.img`
  object-fit: contain;
  height: 100%;
  width: 100%;
`;

export const ImageList: React.FC<ImageListProps> = ({ images }) => {
  return (
    <List>
      {images.map((image) => (
        <div key={image.id}>
          <Image src={image.url} />
        </div>
      ))}
    </List>
  );
};
