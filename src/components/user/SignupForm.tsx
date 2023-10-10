'use client'
import AuthAPI from '@/features/auth';
import { SignupForm } from '@/types/auth';
import React from 'react'
import { useForm } from 'react-hook-form';

function SignupForm() {
    const {
        watch,
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<SignupForm>();

    const onCheckEmail = async() => {
      // 이메일 인증 API 에러 발생중 해결 필요함.
      try {
        const email = watch('email');
        if(!email) {
          alert("이메일을 입력해주세요.");
          return;
        } else {
          const res = AuthAPI.emailAuth(watch('email'));
          console.log(res);
          alert('요청이 처리되었습니다.');
        }
      } catch(error) {
        console.log(error);
      }
      
    }

    const onSubmit = async (data:SignupForm) => {
    const { password_confirm, ...formData } = data;
    try{
        const res = await AuthAPI.join(formData);
          if(res.status === 201){
            alert('회원가입 성공!');
            console.log(res);
          } else {
            console.log(res);
          }
        } catch (error) {
          console.log(error);
        }
    };

  return (
    <section className='bg-blue-400'>
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 flex flex-col gap-2">
      <div className='flex justify-between'>
      <label className="font-bold">이메일</label>
      <button onClick={onCheckEmail} type="button">메일인증</button>
      </div>
      <input
        id="email"
        type="email"
        {...register("email", {
          required: true,
          pattern: /^\S+@\S+$/i, // 이메일 형식 검사
        })}
      />
      {errors.email && <p>This email field is required</p>}
      <br />
      <label>아이디</label>
      <input
        id="username"
        {...register("username", {
          required: true,
          pattern: /^[a-z0-9]+$/, // 알파벳 소문자 및 숫자 검사
          maxLength: 10, // 최대 길이
        })}
      />
      {errors.username && errors.username.type === "required" && (
        <p>아이디를 입력해 주세요.</p>
      )}
      {errors.username && errors.username.type === "pattern" && (
        <p>아이디는 알파벳 소문자(a~z), 숫자(0~9)로 이루어져야 합니다.</p>
      )}
      {errors.username && errors.username.type === "maxLength" && (
        <p>아이디는 최대 10글자로 가능합니다.</p>
      )}
      <br />
      <label>비밀번호</label>
      <input
        id="password"
        type="password"
        {...register("password", {
          required: true,
          minLength: 6, // 최소 길이
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).*$/, // 비밀번호 조건 검사
        })}
      />
      {errors.password && errors.password.type === "required" && (
        <p>비밀번호를 입력해 주세요.</p>
      )}
      {errors.password && errors.password.type === "minLength" && (
        <p>비밀번호는 6자 이상이어야 합니다.</p>
      )}
      {errors.password && errors.password.type === "pattern" && (
        <p>
          비밀번호는 알파벳 대소문자, 숫자, 특수문자(@#$%^&+=!)를 포함해야 합니다.
        </p>
      )}
        <br />
      <label>비밀번호 확인</label>
      <input
        type="password"
        id="password_confirm"
        {...register("password_confirm", {
          required: true,
          validate: (value) => value === watch('password'),
        })}
      />
      {errors.password_confirm &&
        errors.password_confirm.type === "required" && (
          <p>비밀번호 확인을 입력해 주세요.</p>
        )}
      {errors.password_confirm &&
        errors.password_confirm.type === "validate" && (
          <p>비밀번호가 일치하지 않습니다!</p>
        )}
        <br />
      <button className='bg-yellow-400 rounded-xl'>회원가입</button>
    </form>
    </section>
  )
}

export default SignupForm