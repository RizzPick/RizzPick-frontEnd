'use client'
import AuthAPI from '@/features/auth';
import { EmailVerifyReq, SignupErrorRes, SignupForm } from '@/types/auth';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form';
import { SyncLoader } from 'react-spinners';
import Logo from "../../../public/RizzPickLogo.png"
import Image from 'next/image';
import toast from 'react-hot-toast';

function SignupComponent() {
    const {
        watch,
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<SignupForm>();
      const router = useRouter();
      const [showTimer, setShowTimer] = useState(false);
      const [timer, setTimer] = useState(300); // 5분은 300초
      const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
      const [isEmailVerified, setEmailVerified] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      const [verify, setVerify] = useState<EmailVerifyReq>({email:"", authKey:""});
      const [isVerificationSuccessful, setVerificationSuccessful] = useState(false);
      const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        setVerify({
          ...verify,
          authKey : e.target.value
        });
      }

    const onCheckEmail = async() => {
      setIsLoading(true);
      try {
        const email = watch('email');
        if(!email) {
          toast('이메일을 입력해주세요', {icon: '📧',});
          return;
        } else {
          const res = await AuthAPI.emailAuth(email);
          if(res.status === 200) {
            toast.success("인증번호가 전송되었습니다");
            setVerify({...verify, email});
            setEmailVerified(true);
            setShowTimer(true);
            let interval = setInterval(() => {
              setTimer(prevTimer => {
                if (prevTimer <= 1) {
                  clearInterval(interval);
                  setShowTimer(false);
                  return 0;
                }
                return prevTimer - 1;
              });
            }, 1000);
            setIntervalId(interval);
          }
        }
      } catch(error:any) {
        if (error.response) {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    }

    const onCheckEmailVerify = async() => {
      if(!verify.authKey) {
        toast('인증번호를 입력해주세요', {icon: '👀',});
        return;
      } 
      try {
        const response = await AuthAPI.emailAuthVerify(verify);
        if(response.status === 200) {
          toast.success(response.data.message);
          setVerificationSuccessful(true);
          if (intervalId) clearInterval(intervalId);
          setShowTimer(false);
        }
      } catch(error:any) {
        console.log(error);
        toast.error("잘못된 인증 번호입니다.")
      }
    }

    const onSubmit = async (data:SignupForm) => {
    const { password_confirm, ...formData } = data;
    try{
        const res = await AuthAPI.join(formData);
          if(res.status === 201){
            toast.success(res.data.message);
            router.push('/signin');
          }
        } catch (error) {
          const errorMessage = (error as SignupErrorRes).response?.data.message;
        if (errorMessage) {
            toast.error(errorMessage);
        } else {
            console.log(error);
        }
        }
    };

    function renderPasswordErrorMessages(error: any) {
      switch (error.type) {
        case 'pattern':
          return <p className="text-red-500 text-[10px]">✱ 알파벳 대소문자, 숫자, 특수문자를 포함해야 합니다.</p>;
        case 'minLength':
          return <p className="text-red-500 text-[10px]">✱ 비밀번호는 최소 6자리 이상이어야 합니다.</p>;
        case 'validate':
          return <p className="text-red-500 text-[10px]">✱ 일치하지 않습니다.</p>;
        default:
          return null;
      }
    }

  function renderUsernameErrorMessages(error: any) {
    switch (error.type) {
      case 'pattern':
        return <p className="text-red-500 text-[10px]">✱ 아이디는 소문자와 숫자만 포함해야 합니다.</p>;
      case 'maxLength':
        return <p className="text-red-500 text-[10px]">✱ 아이디는 최대 10자리까지만 가능합니다.</p>;
      default:
        return null;
    }
  }

  return (
    <section  className='flex justify-center h-[100vh]'>
      <div className='w-32 h-20 absolute top-[40px] sm:block hidden'>
            <Image src={Logo} alt='로고' fill style={{objectFit:"cover"}} priority/>
      </div>
    <form onSubmit={handleSubmit(onSubmit)} className="sm:absolute sm:bottom-0 p-[80px] sm:p-8 flex flex-col gap-2 bg-white rounded-3xl shadow-xl w-[580px] sm:w-full sm:h-[80vh] h-[730px] sm:rounded-none sm:rounded-tl-[56px] justify-center">
      {/* 로딩 바 */}
      {isLoading && 
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
        <SyncLoader />
      </div>}

    <div className='flex justify-between items-center'>
    <label className="font-bold text-xl">아이디</label>
    {errors.username && renderUsernameErrorMessages(errors.username)}
    </div>
        <input
            id="username"
            className="border rounded-3xl py-2 px-3 w-full text-sm"
            placeholder='아이디는 최대 10자까지 가능합니다'
            required
            {...register("username", {
                required: true,
                pattern: /^[a-z0-9]+$/,
                maxLength: 10,
            })}
        />
        
        <div className='flex justify-between items-center mt-4'>
          <label className="font-bold text-xl">비밀번호</label>
          {errors.password && renderPasswordErrorMessages(errors.password)}
          {errors.password_confirm && renderPasswordErrorMessages(errors.password_confirm)}
        </div>
        <input
            id="password"
            type="password"
            className="border rounded-3xl py-2 px-3 w-full text-sm mb-2"
            placeholder='영어 대소문자,숫자,특수문자 포함 6자 이상'
            required
            {...register("password", {
                required: true,
                minLength: 6,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/,
            })}
        />
        
        <input
            type="password"
            id="password_confirm"
            className="border rounded-3xl py-2 px-3 w-full text-sm"
            placeholder='비밀번호를 한번 더 입력해주세요'
            required
            {...register("password_confirm", {
                required: true,
                validate: (value) => value === watch('password'),
            })}
        />
        <div className='flex justify-between items-center mt-4'>
            <label className="font-bold text-xl">이메일</label>
        </div>
        <div className='flex gap-2 mb-2 w-full'>
          <div className='relative flex justify-between w-full sm:w-[50vw]'>
          <input
              id="email"
              type="email"
              disabled={isEmailVerified}
              className="border rounded-3xl py-2 px-3 text-sm w-[286px] sm:w-[50vw]"
              placeholder='이메일을 입력해주세요'
              required
              {...register("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
              })}
          />
          </div>
              <button onClick={onCheckEmail} disabled={isVerificationSuccessful} type="button" className="bg-gray-500 text-white text-sm px-4 py-1 rounded-full w-40 sm:hidden">인증번호 전송</button>
              <button onClick={onCheckEmail} disabled={isVerificationSuccessful} type="button" className="bg-gray-500 text-white text-sm px-4 py-1 rounded-full w-40 hidden sm:block">인증하기</button>
            </div>
        <div className='flex gap-2 w-full'>
            <div className='relative flex justify-between w-full sm:w-[50vw]'>
                <input type='text' name='verify' onChange={handleChange} value={verify?.authKey} placeholder='인증번호를 입력해주세요' className="w-[286px] sm:w-[50vw] border rounded-3xl py-2 px-3 text-sm" required/>
                {showTimer && <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 font-bold">{Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</span>}
            </div>
            <button type='button' onClick={onCheckEmailVerify} disabled={!isEmailVerified || isVerificationSuccessful} className={`bg-gray-500 text-white text-sm px-4 py-1 rounded-full w-40 ${!isEmailVerified && 'bg-opacity-30'} sm:hidden`}>인증하기</button>
            <button type='button' onClick={onCheckEmailVerify} disabled={!isEmailVerified || isVerificationSuccessful} className={`bg-gray-500 text-white text-sm px-4 py-1 rounded-full w-40 ${!isEmailVerified && 'bg-opacity-30'} hidden sm:block`}>확인</button>
        </div>
        <button className={`bg-gradient-start text-white p-2 font-bold text-xl rounded-3xl mt-8 transition duration-200 ease-in-out ${!isVerificationSuccessful && 'bg-opacity-30'}`} disabled={!isVerificationSuccessful}>가입하기</button>
    </form>
</section>
  )
}

export default SignupComponent