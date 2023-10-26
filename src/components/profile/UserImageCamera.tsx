'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {AiOutlineCloseCircle,AiFillCheckCircle} from "react-icons/ai"
import {FcCancel} from "react-icons/fc"

const UserImageCamera = ({onAddImage,setCameraVisible,setModalVisible}:any) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [CanvasState, setCanvasState] = useState<string>('none');
    const [CameraState, setCameraState] = useState<string>('');
    const [isConfirmVisible, setConfirmVisible] = useState<boolean>(false);
    const [image, setImage] = useState<File | null>(null);

    const startWebcam = useCallback(() => {
        getWebcam((stream: MediaStream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        });
    }, [videoRef]);

    useEffect(() => {
        startWebcam();
        const currentVideoRef = videoRef.current;
    
        return () => {
            if (currentVideoRef) {
                const stream = currentVideoRef.srcObject as MediaStream;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [startWebcam]);  // 종속성 배열에 startWebcam 추가
    

    const addImage = () => {
        onAddImage(image);
        setModalVisible(false);
        setCameraVisible(false);
        setImage(null);
        setCanvasState('none');
        setCameraState('');
        setConfirmVisible(false);
    }

    // 캔버스 상태를 초기화하는 함수
    function resetCanvasState() {
    if (canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        context?.setTransform(1, 0, 0, 1, 0, 0);
    }
    }

    const getWebcam = (callback: (stream: MediaStream) => void) => {
        try {
            const constraints = {
                'video': true,
                'audio': false
            };
            navigator.mediaDevices.getUserMedia(constraints).then(callback);
        } catch (err) {
            console.log(err);
            return undefined;
        }
    }

    const cancel = () => {
        setImage(null);
        setCanvasState('none');
        setCameraState('');
        setConfirmVisible(false);
        resetCanvasState();
        startWebcam();
    }

    function sreenShot() {
        setCanvasState(''); // 켄버스 켜기
        setCameraState('none'); //비디오 끄기
        resetCanvasState();
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            context?.scale(-1, 1);
            context?.translate(-400, 0);  // 이 부분을 canvas의 너비에 맞게 수정
            context?.drawImage(videoRef.current, 0, 0, 400, 500);  // 이 부분을 video와 canvas의 크기에 맞게 수정
            canvasRef.current.toBlob((blob) => {
                const timestamp = Date.now(); // 현재시간값
                let file = new File([blob!], `profile_${timestamp}.jpg`, { type: "image/jpeg" });
                setImage(file)
            }, 'image/jpeg');
            setConfirmVisible(true);
            const s = videoRef.current.srcObject as MediaStream;
            s.getTracks().forEach((track) => {
                track.stop();
            });
        }
    }

    return (
        <div className={`fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center`}>
        <div className={`relative z-20 bg-white w-[400px] ${isConfirmVisible ? ('p-4 rounded-lg'):('')}`}>
        <video 
            id="videoCam" 
            ref={videoRef} 
            autoPlay 
            style={{ 
                display: CameraState, 
                WebkitTransform: "rotateY(180deg)", 
                objectFit: 'cover'  // 이 부분 추가
            }} 
            className='h-[500px] w-full'
        />
        
            <canvas 
                id="canvas" 
                ref={canvasRef} 
                width="400px"   // 이 부분을 video와 동일하게 수정
                height="500px"  // 이 부분을 video와 동일하게 수정
                style={{ display: CanvasState }} 
                className='w-full'
            ></canvas>
            {CanvasState === 'none' ?
            <>
            <div className='absolute top-2 left-2 z-30'>
            <button 
                className='text-white w-6 h-6 rounded-full focus:outline-none hover:scale-125 transition-all'
                onClick={() => setCameraVisible(false)}
            >
                <AiOutlineCloseCircle/>
            </button>
            </div>
                <div onClick={sreenShot} className='flex justify-center items-center w-16 h-16 m-2 rounded-full absolute z-30 bottom-1 left-[170px] cursor-pointer bg-white border'>
                    <div className='text-center w-14 h-14 border-2 rounded-full'/>
                </div> </>:
                <></>
            }
            {isConfirmVisible && (
                <div className="flex justify-center space-x-4 mt-4" id='options'>
                    <button className="bg-gradient-end text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={addImage}>
                        <AiFillCheckCircle/> 등록하기
                    </button>
                    <button className="bg-gray-400 text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={cancel}>
                        <FcCancel/> 취소
                    </button>
                </div>
            )}
        </div>
        <div className='absolute top-0 left-0 w-full h-full bg-black opacity-50'></div>
    </div>
    );
}

export default UserImageCamera;
