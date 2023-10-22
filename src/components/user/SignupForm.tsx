'use client'
import AuthAPI from '@/features/auth';
import { EmailVerifyReq, SignupErrorRes, SignupForm } from '@/types/auth';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form';
import { PacmanLoader } from 'react-spinners';

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
      const [isEmailVerified, setEmailVerified] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      const [verify, setVerify] = useState<EmailVerifyReq>({email:"", authKey:""});
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
          alert("이메일을 입력해주세요.");
          return;
        } else {
          const res = await AuthAPI.emailAuth(email);
          if(res.status === 200) {
            alert('인증번호가 전송되었습니다.');
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
          }
        }
      } catch(error:any) {
        if (error.response) {
          const errorMessage = error.response.data.message;
          alert(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    }

    const onCheckEmailVerify = async() => {
      if(!verify) {
        alert("인증번호를 입력해주세요!");
        return;
      } 
      try {
        const response = await AuthAPI.emailAuthVerify(verify);
        if(response.status === 200) {
          alert(response.data.message);
        }
        console.log(response);
      } catch(error) {
        console.log(error);
      }
    }

    const onSubmit = async (data:SignupForm) => {
    const { password_confirm, ...formData } = data;
    try{
        const res = await AuthAPI.join(formData);
          if(res.status === 201){
            alert(res.data.message);
            router.push('/');
          }
        } catch (error) {
          const errorMessage = (error as SignupErrorRes).response?.data.message;
        if (errorMessage) {
            console.log(errorMessage);
            alert(errorMessage);
        } else {
            console.log(error);
        }
        }
    };

    function renderErrorMessages(error:any) {
      switch(error.type) {
          case 'pattern':
              return <p className="text-red-500">비밀번호는 알파벳 대소문자, 숫자, 특수문자(@#$%^&+=!)를 포함해야 합니다.</p>;
          case 'validate':
              return <p className="text-red-500">일치하지 않습니다.</p>;
          default:
              return null;
      }
  }

  return (
    <section className='min-h-screen flex justify-center items-center'>
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-4 bg-white rounded-3xl shadow-xl w-[500px]">
      {isLoading && 
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <PacmanLoader />
    </div>}
      <div className='flex justify-between'>
    <label className="font-bold text-xl">아이디</label>
    {errors.username && renderErrorMessages(errors.username)}
    </div>
        <input
            id="username"
            className="border rounded-3xl py-2 px-3 w-full text-sm"
            placeholder='아이디를 입력하세요'
            required
            {...register("username", {
                required: true,
                pattern: /^[a-z0-9]+$/,
                maxLength: 10,
            })}
        />
        
        <label className="font-bold text-xl">비밀번호</label>
        <input
            id="password"
            type="password"
            className="border rounded-3xl py-2 px-3 w-full text-sm"
            placeholder='비밀번호를 입력하세요'
            required
            {...register("password", {
                required: true,
                minLength: 6,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/,
            })}
        />
        {errors.password && renderErrorMessages(errors.password)}
        <label className="font-bold text-xl">비밀번호 확인</label>
        <input
            type="password"
            id="password_confirm"
            className="border rounded-3xl py-2 px-3 w-full text-sm"
            placeholder='비밀번호를 입력하세요'
            required
            {...register("password_confirm", {
                required: true,
                validate: (value) => value === watch('password'),
            })}
        />
        {errors.password_confirm && renderErrorMessages(errors.password_confirm)}
        <div className='flex justify-between items-center'>
            <label className="font-bold text-xl">이메일</label>
        </div>
        <div className='flex gap-2'>
        <input
            id="email"
            type="email"
            disabled={isEmailVerified}
            className="border rounded-3xl py-2 px-3 text-sm flex-grow"
            placeholder='이메일을 입력하세요'
            required
            {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i,
            })}
        />
              <button onClick={onCheckEmail} type="button" className="bg-gray-500 text-white text-sm px-4 py-1 rounded-full w-28">인증번호 전송</button>
            </div>
        {errors.email && <p className="text-red-500">This email field is required</p>}
        {/* {isEmailVerified && isVerificationCodeShown && (  */}
        <div className='flex gap-2 w-full'>
            <div className='relative flex justify-between w-full'>
                <input type='text' name='verify' onChange={handleChange} value={verify?.authKey} placeholder='인증번호를 입력하세요' className="border rounded-3xl py-2 px-3 text-sm flex-grow" required/>
                {showTimer && <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500 font-bold">{Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</span>}
            </div>
            <button type='button' onClick={onCheckEmailVerify} className="bg-gray-500 text-white text-sm px-4 py-1 rounded-full w-28">인증하기</button>
        </div>
        <button className='bg-gradient-start text-white p-2 font-bold text-xl rounded-xl mt-4 transition duration-200 ease-in-out'>가입하기</button>
    </form>
</section>
  )
}

export default SignupComponent