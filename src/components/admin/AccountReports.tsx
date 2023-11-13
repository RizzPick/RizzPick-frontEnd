import AdminAPI from '@/features/admin'
import { Report } from '@/types/report';
import React, { useEffect, useState } from 'react'

function AccountReports() {
  const [reports, setReports] = useState<Report[]>();

  useEffect(()=>{
    const getReports = async () => {

      try {
        const response = await AdminAPI.getUserReports();
        if(response.status === 200) {
          setReports(response.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    getReports();
  },[])
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-bold dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-4">#</th>
                  <th scope="col" className="px-6 py-4">신고한 유저</th>
                  <th scope="col" className="px-6 py-4">신고대상</th>
                  <th scope="col" className="px-6 py-4">신고 내용</th>
                </tr>
              </thead>
              <tbody>
                {reports && reports.map((report) => {
                  return (
                    <tr
                      className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600" key={report.id}>
                    <td className="whitespace-nowrap px-6 py-4 font-medium">{report.id}</td>
                    <td className="whitespace-nowrap px-6 py-4">{report.reporter}</td>
                    <td className="whitespace-nowrap px-6 py-4">{report.reported}</td>
                    <td className="whitespace-nowrap px-6 py-4">{report.content}</td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountReports