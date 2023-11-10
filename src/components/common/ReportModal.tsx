import { MatchAPI } from '@/features/match';
import { reportReq } from '@/types/match/type';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const ReportModal = ({ isOpen, onClose, userId } : any) => {
  const [reportReason, setReportReason] = useState('');

  const handleReportSubmit = async() => {
    if(!reportReason.trim()) {
        toast.error("내용을 입력해주세요");
        return;
    }
    const data:reportReq = { content : reportReason, reportedUserId : userId };
    try {
        const response = await MatchAPI.reportUser(data);
        if(response.status === 200) {
            onClose(); // 모달 닫기
            setReportReason(''); // 신고 사유 초기화
            toast.success('신고가 접수되었습니다'); // 사용자에게 알림
        }
    } catch (error) {
        console.log(error);
    }
    
};

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    onClose();
    setReportReason('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleBackdropClick}>
      <div className="bg-white px-4 py-2 rounded-lg shadow-md relative w-[361px]" onClick={e => e.stopPropagation()}>
        <div className='flex justify-center items-center'>
            <h2 className="text-xl font-bold py-1">신고 하기</h2>
        </div>
        <textarea
          className="w-full border p-2 resize-none rounded-lg h-40"
          placeholder="신고 내용을 알려주세요."
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
        />
        <div className="flex justify-around space-x-2 py-2">
          <button onClick={onClose}>취소</button>
          <button className="px-4 py-0.5 bg-fuchsia-400 rounded-xl text-white" onClick={handleReportSubmit}>확인</button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
