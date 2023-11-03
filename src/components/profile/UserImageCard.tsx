'use client';
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import { AiOutlinePlus, AiOutlineClose, AiOutlineMinus } from 'react-icons/ai';
import UserImageCamera from './UserImageCamera';
import { ProfileImages } from '@/types/profile';
import { PuffLoader } from 'react-spinners';
import toast from 'react-hot-toast';

interface Props {
    onImageClick: () => void;
    isModalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
    image: ProfileImages | null;
    onAddImage: any;
    onDeleteImage: any;
    isLoading: boolean;
}

function UserImageCard({
    onAddImage,
    onDeleteImage,
    onImageClick,
    isModalVisible,
    setModalVisible,
    image,
    isLoading,
}: Props) {
    const [isCameraVisible, setCameraVisible] = useState<boolean>(false);
    const imageInput = useRef<HTMLInputElement | null>(null);
    const FILE_SIZE_MAX_LIMIT = 20 * 1024 * 1024;

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const fileList = e.target.files;
        if (!fileList) {
            return;
        }
        const file = fileList[0];
        if (file.size > FILE_SIZE_MAX_LIMIT) {
            e.target.value = '';
            toast.error('업로드 가능한 최대 용량은 20MB입니다.');
            return;
        }
        onAddImage(file);
    };

    const onGallerySelect = () => {
        setModalVisible(false); // 모달을 숨깁니다.
        imageInput.current?.click(); // 이미지 입력을 클릭하여 파일 선택기를 연다.
    };

    const handleImageDelete = async (imageId: number) => {
        toast((t) => (
            <span className="flex flex-col gap-4">
                <div className="text-2xl flex">
                    🗑️ <p className="text-red-500">삭제</p>하시겠습니까?
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={() => {
                            toast('취소되었습니다', { icon: '👨‍💻' }),
                                toast.dismiss(t.id);
                        }}
                        className="hover:scale-110 transition-all duration-200 ease-in-out"
                    >
                        취소
                    </button>
                    <button
                        onClick={() => {
                            onDeleteImage(imageId), toast.dismiss(t.id);
                        }}
                        className="hover:scale-110 transition-all duration-200 ease-in-out"
                    >
                        삭제하기
                    </button>
                </div>
            </span>
        ));
    };
    if (isLoading) {
        return (
            <div className="flex w-36 shadow-lg border-gray-500 rounded-lg h-40 justify-center items-center overflow-hidden">
                <PuffLoader />
            </div>
        );
    }

    return (
        <>
            {image && (
                <div className="relative border-gray-500 rounded sm:w-24 sm:h-36 w-[142px] h-[172px]">
                    <Image
                        src={image.image}
                        alt="Profile Image"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-lg"
                    />
                    <button
                        className="absolute bottom-0 right-0 -mr-2 -mb-2 text-3xl rounded-full bg-[#D57DFF] transform transition-transform duration-500 hover:scale-110"
                        onClick={() => handleImageDelete(image.id)}
                    >
                        <AiOutlineMinus color="#FFFFFF" />
                    </button>
                </div>
            )}
            {!image && (
                <div
                    className="relative border border-gray-400 sm:w-24 sm:h-36 w-[142px] h-[172px] cursor-pointer transition-all hover:scale-105"
                    onClick={onImageClick}
                >
                    <button
                        type="button"
                        className="absolute bottom-0 right-0 -mr-2 -mb-2 text-3xl bg-[#D57DFF] rounded-full transform transition-transform duration-500 hover:rotate-90"
                    >
                        <AiOutlinePlus color="#FFFFFF" />
                    </button>
                </div>
            )}
            <input
                type="file"
                accept="image/gif, image/jpeg, image/jpg, image/png, image/heif, image/heic, image/webp"
                ref={imageInput}
                onChange={handleImageChange}
                className="hidden"
            />
            {isModalVisible && (
                <div
                    className="fixed z-10 top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center"
                    onClick={() => {
                        setModalVisible(false), setCameraVisible(false);
                    }} // 여기서 모달 밖을 클릭했을 때 모달을 닫습니다.
                >
                    <div
                        className="bg-white p-5 rounded-lg flex flex-col gap-4 relative w-96 h-96 sm:justify-center"
                        onClick={(e) => e.stopPropagation()} // 모달 안을 클릭하면 이벤트 전파를 막아서 모달이 닫히지 않게 합니다.
                    >
                        <p className="font-bold text-2xl">
                            새 미디어 콘텐츠 만들기
                        </p>
                        <p className="font-semibold text-gray-500 mb-4">
                            콘텐츠 유형 선택
                        </p>
                        <button
                            onClick={onGallerySelect}
                            className="bg-red-300 h-24 rounded-lg text-white transition-transform duration-300 transform hover:scale-105"
                        >
                            갤러리에서 사진 선택
                        </button>
                        <button
                            onClick={() => setCameraVisible(true)}
                            className="bg-blue-300 h-24 rounded-lg text-white transition-transform duration-300 transform hover:scale-105 sm:hidden"
                        >
                            카메라로 사진 촬영
                        </button>
                        {isCameraVisible && (
                            <UserImageCamera
                                onAddImage={onAddImage}
                                setCameraVisible={setCameraVisible}
                                setModalVisible={setModalVisible}
                            />
                        )}
                        <button
                            className="absolute top-0 right-0 p-4 transform transition-transform duration-500 hover:rotate-90"
                            onClick={() => setModalVisible(false)}
                        >
                            <AiOutlineClose />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default UserImageCard;
