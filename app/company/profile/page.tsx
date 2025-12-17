'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CompanyProfile {
  id: number;
  name: string;
  email: string;
  country?: string;
  city?: string;
  website?: string;
  companyLogo?: string;
  overview?: string;
  foundedYear?: number;
  capital?: string;
  employees?: number;
  representative?: string;
  headquarters?: string;
  recruitmentTypes?: string;
  recruitmentTarget?: string;
  employmentType?: string;
  workLocation?: string;
  workingHours?: string;
  initialSalary?: string;
  annualSalary?: string;
  bonusInfo?: string;
  benefits?: string;
  socialInsurance?: string;
  housingAllowance?: string;
  transportationAllowance?: string;
  training?: string;
  certificateSupport?: string;
  avgAge?: string;
  genderRatio?: string;
  overtimeHours?: string;
  vacationRate?: string;
  remoteFlexible?: string;
  foreignerHiringRecord?: string;
  visaSupport?: string;
  internalLanguage?: string;
  japaneseLevel?: string;
  acceptedNationality?: string;
  livingSupport?: string;
}

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) {
      router.push('/company/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/company/profile?companyId=${companyId}`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!profile) return <div className="p-4">No profile found</div>;

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-black">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">企業プロフィール</h1>
        <Link href="/company" className="text-sm text-indigo-600 hover:underline">TOPに戻る</Link>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow p-6 border-b-4 border-blue-600">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">{profile.name}</h2>
              <p className="text-sm text-slate-600 mt-1">登録会社</p>
            </div>
            <Link href="/company/profile/edit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700">
              編集する
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <span className="text-xs text-slate-600 font-semibold uppercase">メール</span>
              <p className="text-sm text-slate-800 mt-1">{profile.email}</p>
            </div>
            <div>
              <span className="text-xs text-slate-600 font-semibold uppercase">国</span>
              <p className="text-sm text-slate-800 mt-1">{profile.country || '-'}</p>
            </div>
            <div>
              <span className="text-xs text-slate-600 font-semibold uppercase">都市</span>
              <p className="text-sm text-slate-800 mt-1">{profile.city || '-'}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">プロフィール詳細</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="border-b pb-3 col-span-2">
              <span className="text-xs text-slate-600 font-semibold uppercase">会社ロゴ</span>
              {profile.companyLogo ? (
                <div className="mt-2 w-24 h-24 bg-gray-100 rounded border border-slate-300 flex items-center justify-center overflow-hidden">
                  <img 
                    src={profile.companyLogo} 
                    alt="Company logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <p className="text-slate-800 mt-1">-</p>
              )}
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">設立年</span>
              <p className="text-slate-800 mt-1">{profile.foundedYear || '-'}</p>
            </div>
            <div className="border-b pb-3 col-span-2">
              <span className="text-xs text-slate-600 font-semibold uppercase">概要</span>
              <p className="text-slate-800 mt-1">{profile.overview || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">資本金</span>
              <p className="text-slate-800 mt-1">{profile.capital || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">従業員数</span>
              <p className="text-slate-800 mt-1">{profile.employees || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">代表者</span>
              <p className="text-slate-800 mt-1">{profile.representative || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">本社</span>
              <p className="text-slate-800 mt-1">{profile.headquarters || '-'}</p>
            </div>
          </div>
        </div>

        {/* Recruitment Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">採用情報</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">採用タイプ</span>
              <p className="text-slate-800 mt-1">{profile.recruitmentTypes || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">採用ターゲット</span>
              <p className="text-slate-800 mt-1">{profile.recruitmentTarget || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">雇用形態</span>
              <p className="text-slate-800 mt-1">{profile.employmentType || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">勤務地</span>
              <p className="text-slate-800 mt-1">{profile.workLocation || '-'}</p>
            </div>
            <div className="col-span-2 border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">勤務時間</span>
              <p className="text-slate-800 mt-1">{profile.workingHours || '-'}</p>
            </div>
          </div>
        </div>

        {/* Salary & Benefits */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">給与・福利厚生</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">初年度給与</span>
              <p className="text-slate-800 mt-1">{profile.initialSalary || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">年間給与</span>
              <p className="text-slate-800 mt-1">{profile.annualSalary || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">ボーナス</span>
              <p className="text-slate-800 mt-1">{profile.bonusInfo || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">福利厚生</span>
              <p className="text-slate-800 mt-1">{profile.benefits || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">社会保険</span>
              <p className="text-slate-800 mt-1">{profile.socialInsurance || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">住宅手当</span>
              <p className="text-slate-800 mt-1">{profile.housingAllowance || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">交通費</span>
              <p className="text-slate-800 mt-1">{profile.transportationAllowance || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">研修</span>
              <p className="text-slate-800 mt-1">{profile.training || '-'}</p>
            </div>
            <div className="col-span-2 border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">資格取得支援</span>
              <p className="text-slate-800 mt-1">{profile.certificateSupport || '-'}</p>
            </div>
          </div>
        </div>

        {/* Work Environment */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">職場環境</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">平均年齢</span>
              <p className="text-slate-800 mt-1">{profile.avgAge || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">性別構成</span>
              <p className="text-slate-800 mt-1">{profile.genderRatio || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">平均残業時間</span>
              <p className="text-slate-800 mt-1">{profile.overtimeHours || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">有給休暇取得率</span>
              <p className="text-slate-800 mt-1">{profile.vacationRate || '-'}</p>
            </div>
            <div className="col-span-2 border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">リモート柔軟</span>
              <p className="text-slate-800 mt-1">{profile.remoteFlexible || '-'}</p>
            </div>
          </div>
        </div>

        {/* Foreign Hiring */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">海外採用・VISA対応</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">外国人採用実績</span>
              <p className="text-slate-800 mt-1">{profile.foreignerHiringRecord || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">ビザサポート</span>
              <p className="text-slate-800 mt-1">{profile.visaSupport || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">社内言語</span>
              <p className="text-slate-800 mt-1">{profile.internalLanguage || '-'}</p>
            </div>
            <div className="border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">日本語レベル</span>
              <p className="text-slate-800 mt-1">{profile.japaneseLevel || '-'}</p>
            </div>
            <div className="col-span-2 border-b pb-3">
              <span className="text-xs text-slate-600 font-semibold uppercase">受け入れ国籍</span>
              <p className="text-slate-800 mt-1">{profile.acceptedNationality || '-'}</p>
            </div>
            <div className="col-span-2">
              <span className="text-xs text-slate-600 font-semibold uppercase">生活支援</span>
              <p className="text-slate-800 mt-1">{profile.livingSupport || '-'}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3">
          <Link href="/company/profile/edit" className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700">
            編集する
          </Link>
          <Link href="/company" className="px-4 py-2 bg-slate-600 text-white text-sm font-semibold rounded hover:bg-slate-700">
            TOPに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
