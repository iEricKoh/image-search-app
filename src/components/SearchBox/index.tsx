import React from 'react';

interface Props {
  onSearch:(v:string)=>void
}

// 定义 ImageList 组件
export const SearchBox: React.FC<Props> = ({ onSearch }) => {
  return (
    <div>
      <input onChange={e=>{
        onSearch(e.target.value)
      }}/>
    </div>
  );
};
