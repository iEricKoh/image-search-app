import React from 'react';
import styled from 'styled-components';


export interface Image {
  url: string,
  id: string
}

interface ImageListProps {
  images: Image[];
}

const List = styled.div`
display: grid;
grid-template-columns: repeat(4, 1fr);
`

export const ImageList: React.FC<ImageListProps> = ({ images }) => {
  return (
    <List>
      {images.map((image) => (
        <img key={image.id} src={image.url}  />
      ))}
    </List>
  );
};

