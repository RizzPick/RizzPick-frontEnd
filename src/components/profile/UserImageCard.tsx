'use client'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import UserImageCamera from './UserImageCamera';
import { ProfileImages } from '@/types/profile';
import { PuffLoader } from "react-spinners"

interface Props {
    onImageClick: () => void;
    isModalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    image : ProfileImages | null;
    isLoading : boolean;
    onAddImage: any;
    onDeleteImage : any;
  }

function UserImageCard({ onAddImage, onDeleteImage,onImageClick, isModalVisible, setModalVisible, image,isLoading }: Props) {
  const [isCameraVisible, setCameraVisible] = useState<boolean>(false);
  const imageInput = useRef<HTMLInputElement | null>(null);
  const FILE_SIZE_MAX_LIMIT = 20 * 1024 * 1024;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
   
    if (!fileList) {
      return;
    }
      const file = fileList[0];
      if(file.size > FILE_SIZE_MAX_LIMIT) {
        e.target.value = "";
        alert("업로드 가능한 최대 용량은 20MB입니다.");
        return;
      }
      onAddImage(file);
  };

const onGallerySelect = () => {
    setModalVisible(false);  // 모달을 숨깁니다.
    imageInput.current?.click();  // 이미지 입력을 클릭하여 파일 선택기를 연다.
};

const handleImageDelete = async (imageId : number) => {
  const ys = window.confirm('정말 삭제하시겠습니까?');
  if(ys) {
    onDeleteImage(imageId);
  } else {
    alert("취소되었습니다.")
    return;
  }
}
  if(isLoading) {
    return (
      <div className='flex w-36 shadow-lg border-gray-500 rounded-lg h-40 justify-center items-center overflow-hidden'>
        <PuffLoader />
      </div>
    )
  }

  return (
    <>
    {image && 
      <div className='relative w-36 shadow-lg border-gray-500 rounded-lg h-40 transition-all hover:scale-105'>
        <Image src={image.image} alt="Profile Image" layout="fill" objectFit='fill' /> 
          <button className='absolute -bottom-2 -right-2 text-2xl rounded-full bg-white border' onClick={()=>handleImageDelete(image.id)}><AiOutlineClose/></button>
      </div>  
    }
    {!image && 
      <div className='relative w-36 shadow-lg border-gray-500 rounded-lg h-40 cursor-pointer transition-all hover:scale-105' onClick={onImageClick}>
        <button type="button" className='absolute -bottom-2 -right-2 text-2xl bg-white rounded-full border'><AiOutlinePlus/></button>
      </div>
    }
      <input
        type="file"
        accept="image/*"
        ref={imageInput}
        onChange={handleImageChange}
        className='hidden'
      />
      {isModalVisible && (
                <div className="fixed z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-lg flex flex-col gap-4 relative w-96 h-96">
                        <p className='font-bold text-2xl'>새 미디어 콘텐츠 만들기</p>
                        <p className='font-semibold text-gray-500 mb-4'>콘텐츠 유형 선택</p>
                        <button onClick={onGallerySelect} className='bg-red-300 h-24 rounded-lg text-white'>갤러리에서 사진 선택</button>
                        <button onClick={() => setCameraVisible(true)} className='bg-blue-300 h-24 rounded-lg text-white'>카메라로 사진 촬영</button>
                        {isCameraVisible && <UserImageCamera />}
                        <button className='absolute top-0 right-0 p-4' onClick={() => setModalVisible(false)}><AiOutlineClose/></button>
                    </div>
                </div>
            )}
      </>
  )
}

export default UserImageCard