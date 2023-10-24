'use client';

import axios from 'axios';

export default function Detail() {
    return (
        <div className=" w-3/4 h-[100vh] p-4 mx-auto">
            <div className="w-full flex flex-col items-center">
                <h1 className="text-2xl p-4">
                    {`'유저의 닉네임'님의 데이트 계획`}
                </h1>
            </div>
            <div className="flex flex-row items-center p-4 w-full">
                <div className="flex flex-col items-center p-4">
                    <span>제목 :</span>
                    <span>지역 :</span>
                    <span>주제 :</span>
                </div>
                <div className="flex-col items-center p-4 w-full">
                    <h3 className="">데이트 내용</h3>
                    <div>활동 :</div>
                </div>
            </div>
        </div>
    );
}
