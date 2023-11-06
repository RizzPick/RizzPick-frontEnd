import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import UseProfile from './useProfile';
import UseChat from './useChat';
import { eraseCookie } from '@/utils/cookie';

export default function useAuth() {
  const router = useRouter();
  const { clearCurrentProfile } = UseProfile();
  const { clearCurrentChat } = UseChat();

  const logout = () => {
    eraseCookie('Authorization');
    eraseCookie('Authorization_Refresh');
    eraseCookie('status');
    sessionStorage.clear();

    // 프로필과 채팅 관련 상태 초기화
    clearCurrentProfile();
    clearCurrentChat();

    // 로그아웃 성공 토스트 메시지
    toast.success('로그아웃 처리되었습니다');

    // 홈으로 리다이렉트
    router.push('/');
  };

  return { logout };
}