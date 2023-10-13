'use client'
import ProfileAPI from '@/features/profile';
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai';
import UserImageCamera from './UserImageCamera';
import { ProfileImages } from '@/types/profile';
import { mutate } from 'swr';
import { PROFILE_KEY } from '@/hooks/useProfile';
import { PuffLoader } from "react-spinners"

interface Props {
    onImageClick: () => void;
    isModalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    image : ProfileImages | null;
    isLoading : boolean;
  }

function UserImageCard({ onImageClick, isModalVisible, setModalVisible, image,isLoading }: Props) {

  const [isCameraVisible, setCameraVisible] = useState<boolean>(false);
  const imageInput = useRef<HTMLInputElement | null>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      const file = fileList[0];
      const url = URL.createObjectURL(file);

      // API 호출 로직
      const formData = new FormData();
      formData.append('action', "ADD");
      formData.append('image', file);

      try {
        const response = await ProfileAPI.updateImage(formData);
        mutate(PROFILE_KEY, (currentData:any) => {
          console.log(currentData);
          return {
              ...currentData,
                profileImages: [...currentData.profileImages, response.data.data]
              }
      }, false);  // revalidate를 false로 설정하여 재검증 없이 데이터만 갱신
        console.log(response.data);

      } catch (error) {
        // API 호출 실패 시 처리 로직
        console.error("Image upload failed:", error);
      }
    }
  };

const onGallerySelect = () => {
    setModalVisible(false);  // 모달을 숨깁니다.
    imageInput.current?.click();  // 이미지 입력을 클릭하여 파일 선택기를 연다.
};

const handleImageDelete = async (imageId : number) => {

  const ys = window.confirm('정말 삭제하시겠습니까?');
  if(ys) {
    const formData = new FormData();
    formData.append('action', "DELETE");
    formData.append('id', imageId.toString());
    try {
      const response = await ProfileAPI.updateImage(formData);
      mutate(PROFILE_KEY, (currentData:any) => {
        console.log(currentData);
        return {
            ...currentData,
            profileImages: currentData.profileImages.filter((image:any) => image.id !== imageId)
            }
    }, false);  // revalidate를 false로 설정하여 재검증 없이 데이터만 갱신
      console.log(response);
      alert("삭제 처리되었습니다.");
    } catch(error) {
      console.log(error);
    }
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