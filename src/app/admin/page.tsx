'use client'
import React, { useState } from 'react';
import AccountReports from '@/components/admin/AccountReports'; // 계정 신고 컴포넌트
import DateReports from '@/components/admin/DateReports'; // 데이트 신고 컴포넌트

const AdminReportPage = () => {
  const [selectedMenu, setSelectedMenu] = useState('account');

  // 선택된 메뉴에 따라 렌더링할 컴포넌트를 결정합니다.
  const renderContent = () => {
    switch (selectedMenu) {
      case 'account':
        return <AccountReports />;
      case 'date':
        return <DateReports />;
      default:
        return <div>선택된 메뉴가 없습니다.</div>;
    }
  };

  return (
    <div className="flex">
      {/* 사이드바 */}
      <div className="w-1/5 bg-gray-800 min-h-screen text-white">
        <div className="flex flex-col p-4">
          <a
            href="#account"
            onClick={() => setSelectedMenu('account')}
            className={`p-2 ${selectedMenu === 'account' ? 'bg-gray-700' : ''}`}
          >
            계정 신고
          </a>
          <a
            href="#date"
            onClick={() => setSelectedMenu('date')}
            className={`p-2 ${selectedMenu === 'date' ? 'bg-gray-700' : ''}`}
          >
            데이트 신고
          </a>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="w-4/5 p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminReportPage;
