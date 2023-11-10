import React from 'react';
import Image from 'next/image';
import LikeIcon from '../../../public/matchIcon/Like.png';
import NopeIcon from '../../../public/matchIcon/Nope.png';

type Props =  {
  onReaction :  (reaction: 'like' | 'nope') => void;
}

function MatchControls({ onReaction }: Props) {
  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = () => {
      onReaction('like');
  };

  // 싫어요 버튼 클릭 핸들러
  const handleNopeClick = () => {
      onReaction('nope');
  };

  return (
    <div className="absolute w-[30vw] flex justify-center -bottom-28 gap-48 sm:bottom-5 z-60 sm:w-full sm:justify-center sm:px-4 z-20">
      <button onClick={handleNopeClick} className='transform transition-transform duration-500 hover:rotate-90'>
        <Image src={NopeIcon} alt="Nope" width={60} height={60} />
      </button>
      <button onClick={handleLikeClick} className='animate-pulse animate-twice animate-ease-in-out'>
        <Image src={LikeIcon} alt="Like" width={60} height={60} />
      </button>
    </div>
  );
};

export default MatchControls;
