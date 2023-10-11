'use client'
import AuthAPI from '@/features/auth';
import { EmailVerifyReq, SignupErrorRes, SignupForm } from '@/types/auth';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form';

function SignupForm() {
    const {
        watch,
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<SignupForm>();
      const router = useRouter();

      const [isEmailVerified, setEmailVerified] = useState(false);
      const [verify, setVerify] = useState<EmailVerifyReq>({email:"", authKey:""});
      const onChange = (e:ChangeEvent<HTMLInputElement | null>) => {
        setVerify({
          ...verify,
          authKey : e.target.value
        });
      }

    const onCheckEmail = async() => {
      try {
        const email = watch('email');
        if(!email) {
          alert("이메일을 입력해주세요.");
          return;
        } else {
          console.log(email);
          const res = await AuthAPI.emailAuth(email);
          if(res.status === 200) {
            alert('인증번호가 전송되었습니다.');
            setVerify({...verify, email});
            setEmailVerified(true);
          }
        }
      } catch(error) {
        console.log(error);
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
          case 'required':
              return <p className="text-red-500">This field is required</p>;
          case 'pattern':
              return <p className="text-red-500">Pattern does not match</p>;
          case 'minLength':
              return <p className="text-red-500">Too short</p>;
          case 'validate':
              return <p className="text-red-500">Values do not match</p>;
          default:
              return null;
      }
  }

  return (
    <section className='bg-blue-400 min-h-screen flex justify-center items-center'>
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-6 bg-white rounded-xl shadow-xl w-96">
        <div className='flex justify-between items-center'>
            <label className="font-bold text-xl">이메일</label>
            <button onClick={onCheckEmail} type="button" className="bg-green-500 text-white px-4 py-1 rounded-full" disabled={isEmailVerified}>인증요청</button>
        </div>
        <input
            id="email"
            type="email"
            disabled={isEmailVerified}
            className="border rounded-md p-2 w-full"
            {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i,
            })}
        />
        {errors.email && <p className="text-red-500">This email field is required</p>}
        {isEmailVerified && ( 
                <div className='flex gap-2'>
                    <input type='text' name='verify' onChange={onChange} value={verify?.authKey} placeholder='인증번호를 입력하세요' className="border rounded-md p-2 flex-grow"/>
                    <button type='button' onClick={onCheckEmailVerify} className="bg-green-500 text-white px-4 py-1 rounded-full">인증</button>
                </div>
            )}

        <label className="font-bold text-xl">아이디</label>
        <input
            id="username"
            className="border rounded-md p-2 w-full"
            {...register("username", {
                required: true,
                pattern: /^[a-z0-9]+$/,
                maxLength: 10,
            })}
        />
        {errors.username && renderErrorMessages(errors.username)}

        <label className="font-bold text-xl">비밀번호</label>
        <input
            id="password"
            type="password"
            className="border rounded-md p-2 w-full"
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
            className="border rounded-md p-2 w-full"
            {...register("password_confirm", {
                required: true,
                validate: (value) => value === watch('password'),
            })}
        />
        {errors.password_confirm && renderErrorMessages(errors.password_confirm)}

        <button className='bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-xl w-full mt-4 transition duration-200 ease-in-out'>회원가입</button>
    </form>
</section>
  )
}

export default SignupForm