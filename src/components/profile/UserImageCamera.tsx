'use client'
import React, { useEffect, useRef, useState } from 'react'

const UserImageCamera: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [CanvasState, setCanvasState] = useState<string>('none');
    const [CameraState, setCameraState] = useState<string>('');
    const [isConfirmVisible, setConfirmVisible] = useState<boolean>(false);

    useEffect(() => {
        getWebcam((stream: MediaStream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        });
    }, []);

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

    function sreenShot() {
        setCanvasState(''); // 켄버스 켜기
        setCameraState('none'); //비디오 끄기
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            context?.scale(-1, 1);
            context?.translate(-300, 0);
            context?.drawImage(videoRef.current, 0, 0, 300, 400);
            canvasRef.current.toBlob((blob) => {
                let file = new File([blob!], "fileName.jpg", { type: "image/jpeg" });
                // 추후 사용할 파일 객체: uploadFile
            }, 'image/jpeg');

            const image = canvasRef.current.toDataURL();
            console.log(image);
            setConfirmVisible(true);

            const s = videoRef.current.srcObject as MediaStream;
            s.getTracks().forEach((track) => {
                track.stop();
            });
        }
    }

    return (
        <div className='z-20 bg-white w-[400px] absolute'>
            <video id="videoCam" ref={videoRef} autoPlay style={{ display: CameraState, WebkitTransform: "rotateY(180deg)" }} className='h-[500px]' />
            <canvas id="canvas" ref={canvasRef} width="300px" height="400px" style={{ display: CanvasState }}></canvas>
            {CanvasState === 'none' ?
                <div onClick={sreenShot} className='flex justify-center items-center w-16 h-16 m-2 rounded-full absolute z-30 bottom-1 cursor-pointer bg-white border'>
                    <div className='text-center w-14 h-14 border-2 rounded-full'/>
                </div> :
                <></>
            }
            {isConfirmVisible && (
                <div className="flex justify-center space-x-4 mt-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        등록
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-md">
                        취소
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserImageCamera;
