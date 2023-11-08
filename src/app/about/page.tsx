'use client'
import React from 'react'
import Logo from '../../../public/Logo.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


function AboutPage() {
    const router = useRouter();
  return (
    <div className='height-screen-vh w-full bg-sendbtn-gradient'>
        <header className="flex justify-between w-full p-4">
                <div
                    className={`text-white flex flex-row items-center`}
                >
                    <div className="w-[95px] h-[40px] relative cursor-pointer" onClick={()=>router.push('/')}>
                        <Image
                            src={Logo}
                            alt="로고"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                    <div className='text-3xl text-white font-bold ml-10 cursor-pointer' onClick={()=>router.push('/about')}>
                        소개
                    </div>
                </div>
                <h2
                    className={`text-3xl font-bold text-white cursor-pointer`}
                    onClick={() => router.push('/signin')}
                >
                    로그인
                </h2>
            </header>
                <div className='flex flex-col text-white w-[60vw] items-center mx-auto'>

                {/* 첫 번째 블록 */}
                <div className='text-2xl font-semibold mb-[53px]'>Will You</div>
                <div className='text-3xl font-bold'>우리는 친밀하고 의미 있는 관계를 유도하고자 합니다.</div>
                <div className='text-3xl font-bold mb-[64px]'>매력적인 데이트 계획을 중심으로</div>
                <hr className='w-full text-white mb-[39px]'/>

                {/* 두 번째 블록 */}
                <div className='flex justify-start flex-col w-full px-14'>
                    <div className='text-2xl mb-[52px]'>Will You의 가치</div>
                    <div className='text-xl mb-[37px]'>
                        매력적인 데이트 계획은 관계의 핵심입니다.<br/>
                        데이트 계획이 단순한 만남 이상의 의미를 갖게 되는 순간,<br/>
                        우리는 서로에 대한 깊은 이해와 연결을 느낍니다.<br/>
                        이러한 특별한 계획은 우리 사이의 특별한 순간을 제공하며, 함께 보낸 시간의 질을 향상시킵니다.
                    </div>
                    <div className='text-2xl mb-[40px]'>
                        우리는 매력적인 데이트 계획을 성공적으로 이루기 위한 세 가지 핵심 가치를<br/>
                        중요하게 생각합니다.
                    </div>
                    <div className='flex items-end gap-4 mb-[59px]'>
                        <span className='text-3xl font-bold'>진실성</span>
                        <p className='text-xl'>우리는 서로의 기대와 바람을 숨기지 않고 솔직하게 공유합니다.</p>
                    </div>
                    <div className='flex items-center gap-4 mb-[73px]'>
                        <span className='text-3xl font-bold leading-loose'>모험성</span>
                        <p className='text-xl leading-tight'>
                            기억에 남는 데이트를 위해 새로운 경험을 탐험하고,<br/>
                            때로는 익숙한 경로를 벗어나는 용기를 보입니다.
                        </p>
                    </div>
                    <div className='flex items-center gap-4 mb-[52px]'>
                        <span className='text-3xl font-bold leading-loose'>이해</span>
                        <p className='text-xl leading-tight'>
                            데이트는 서로를 더 잘 알아가는 시간입니다. 그렇기에 우리는 상대의 관점을<br/>
                            깊이 고려하며, 서로의 이야기에 귀 기울입니다.
                        </p>
                    </div>
                </div>
                <hr className='w-full text-white mb-[44px]'/>

                    {/* 세 번째 블록 */}
                    <div className='flex flex-col justify-start w-full px-14'>
                        <div className='text-2xl mb-[52px]'>Will You의 원칙</div>
                        <div className='text-xl mb-[33px]'>
                            우리는 데이트 계획의 중요성을 실천하고 있습니다.<br/>
                            우리의 원칙은 모든 결정에서 &quot;완벽한 데이트 계획&quot;의 가치를 중심으로 합니다.
                        </div>

                        {/* 첫 번째 원칙 */}
                        <div className='flex flex-col mb-[31px]'>
                            <div className='text-3xl mb-[30px]'>
                                01<br/>
                                계획을 위한 설계
                            </div>
                            <div className='text-2xl'>
                                Will You는 사용자가 더 의미있고 매력적인 데이트 계획을 세울<br/>
                                수 있도록 도와줍니다. 우리의 목표는 사용자가 서로의 시간을 최<br/>
                                대한 활용하도록 도와주는 것입니다.
                            </div>
                        </div>

                        {/* 두 번째 원칙 */}
                        <div className='flex flex-col items-end mb-[30px]'>
                            <div className='flex text-3xl'>
                                02
                            </div>
                            <div className='flex text-3xl mb-[30px]'>
                                최고의 데이트 계획을 위한 피드백
                            </div>
                            <div className='text-2xl'>
                                우리는 사용자들의 피드백을 진심으로 수용하며,
                            </div>
                            <div className='text-2xl'>
                                그 피드백을 통해 데이트 계획의 품질을 지속적으로
                            </div>
                            <div className='text-2xl'>
                                향상시킵니다. 각 데이트 계획은 사용자의 경험을
                                최우선으로 고려합니다.
                            </div>
                            <div className='text-2xl'>
                                최우선으로 고려합니다.
                            </div>
                        </div>

                        {/* 세 번째 원칙 */}
                        <div className='flex flex-col'>
                            <div className='text-3xl mb-[30px]'>
                                03<br/>
                                데이트 계획의 혁신
                            </div>
                            <div className='text-2xl mb-[22px]'>
                                Will You는 전통적인 데이트 방식을 넘어서, 새롭고 독창적인<br/>
                                데이트 아이디어를 제안합니다. 우리는 사용자들의 특별하고<br/>
                                기억에 남는 데이트를 경험할 수 있도록 끊임없이 연구하고<br/>
                                발접시킵니다.
                            </div>
                        </div>

                        {/* 네 번째 원칙 */}
                        <div className='flex flex-col items-end mb-[30px]'>
                            <div className='flex text-3xl'>
                                04
                            </div>
                            <div className='flex text-3xl mb-[30px]'>
                                원칙에 기반한 가이드
                            </div>
                            <div className='text-2xl'>
                                우리는 데이트 계획의 중요성을 알고 있습니다.
                            </div>
                            <div className='text-2xl'>
                                그래서 우리는 어떤 계획이 완벽한지, 그리고 그것이
                            </div>
                            <div className='text-2xl'>
                                왜 중요한지에 대한 원칙을 만들었습니다.
                            </div>
                            <div className='text-2xl'>
                                이 원칙은 우리의 의사 결정 과정을 가속화하며
                            </div>
                            <div className='text-2xl'>
                                팀 내의 명확성을 제공합니다.
                            </div>
                        </div>

                        {/* 다섯 번째 원칙 */}
                        <div className='flex flex-col mb-[54px]'>
                            <div className='text-3xl mb-[30px]'>
                                05<br/>
                                매력적인 계획의 주역들
                            </div>
                            <div className='text-2xl mb-[22px]'>
                                Will You 팀은 데이트 계획의 중요성을 실천하는 팀 플레이어로<br/>
                                구성되어 있습니다. 여기에서 우리는 Will You의 문화를 함께<br/>
                                창조하고, 그 가치를 만듭니다.
                            </div>
                        </div>
                    </div>
                    <hr className='w-full text-white mb-[40px]'/>

                    {/* 네 번째 블록 */}
                    <div className='flex justify-start flex-col w-full px-14'>
                    <div className='text-2xl mb-[76px]'>Will You와 함께하는 데이트의 특별함</div>
                    <div className='text-2xl mb-[12px]'>
                        당신만을 위한 데이트 스토리
                    </div>
                    <div className='text-xl mb-[39px]'>
                        각자의 데이트는 독특한 이야기를 담고 있습니다. Will You는 그 이야기를<br/>
                        완벽하게 반영한 데이트 계획을 제시합니다.<br/>
                    </div>
                    <div className='text-2xl mb-[12px]'>
                        당신의 데이트 후기, 그 소중한 이야기
                    </div>
                    <div className='text-xl mb-[39px]'>
                        데이트 후의 소감이 궁금합니다. 소중한 순간을 Will You와 함께<br/>
                        나누어 보세요.<br/>
                    </div>
                    <div className='text-2xl mb-[12px]'>
                        우리만의 데이트 매칭 시스템
                    </div>
                    <div className='text-xl mb-[39px]'>
                        데이트의 성공은 케미스트리에서 시작됩니다.<br/>
                        WIll You의 특별한 매칭 시스템으로 최적의 데이트를 경험하세요.<br/>
                    </div>
                    <div className='text-2xl mb-[12px]'>
                        매력적인 데이트, 그것이 우리의 목표
                    </div>
                    <div className='text-xl mb-[39px]'>
                        당신의 시간은 소중합니다. Will You는 특별하고 의미 있는<br/>
                        데이트를 위해 항상 노력합니다.<br/>
                    </div>
                    <div className='text-2xl mb-[12px]'>
                        당신의 선택, 그것을 중요하게 생각합니다
                    </div>
                    <div className='text-xl mb-[39px]'>
                        데이트의 모든 순간에서 당신의 선택을 존중하며, 그 선택에<br/>
                        따른 최선의 결과를 제공하려고 노력합니다.<br/>
                    </div>
                    <div className='text-2xl mb-[12px]'>
                        솔직한 데이트 피드백 시스템
                    </div>
                    <div className='text-xl mb-[39px]'>
                        당신의 데이트 경험을 솔직하게 공유하세요.<br/>
                        그것이 Will You가 더 나아질 수 있는 원동력입니다.<br/>
                    </div>
                    <div className='text-2xl mb-[12px]'>
                        똑똑한 데이트, Will You와 함께
                    </div>
                    <div className='text-xl mb-[107px]'>
                        당신의 데이트 스타일, 선호도, 기대를 이해하고, 그에 맞는<br/>
                        데이트를 지속적으로 제안합니다. Will You와 함께라면<br/>
                        데이트가 더 특별해집니다.
                    </div>
                </div>
            </div>
    </div>
  )
}

export default AboutPage