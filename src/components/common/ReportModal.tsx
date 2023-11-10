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
        console.log(response);
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
      <div className="bg-white p-4 rounded-lg shadow-md relative w-[300px]" onClick={e => e.stopPropagation()}>
        <div className='flex justify-between items-center mb-4'>
            <h2 className="text-xl font-bold">신고하기</h2>
            <button onClick={onClose} className="text-lg font-bold">&times;</button>
        </div>
        <textarea
          className="w-full border p-2 mb-4"
          placeholder="신고내용을 입력해주세요"
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
        />
        <div className="flex justify-around space-x-2">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>취소하기</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleReportSubmit}>신고하기</button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
