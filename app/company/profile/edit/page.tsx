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

export default function CompanyProfileEditPage() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (profile) {
      const { name, value } = e.target;
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // ファイルアップロードはフォーム送信時に処理
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    const companyId = localStorage.getItem('companyId');

    try {
      const formData = new FormData();
      
      // ファイルアップロード
      const fileInput = (e.target as HTMLFormElement).querySelector('input[name="logoFile"]') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append('companyLogo', fileInput.files[0]);
      }

      // その他のフィールド
      const fieldsToSend = [
        'overview', 'foundedYear', 'capital', 'employees', 'representative',
        'headquarters', 'recruitmentTypes', 'recruitmentTarget', 'employmentType',
        'workLocation', 'workingHours', 'initialSalary', 'annualSalary', 'bonusInfo',
        'benefits', 'socialInsurance', 'housingAllowance', 'transportationAllowance',
        'training', 'certificateSupport', 'avgAge', 'genderRatio', 'overtimeHours',
        'vacationRate', 'remoteFlexible', 'foreignerHiringRecord', 'visaSupport',
        'internalLanguage', 'japaneseLevel', 'acceptedNationality', 'livingSupport'
      ];

      fieldsToSend.forEach(field => {
        const value = profile[field as keyof CompanyProfile];
        if (value !== null && value !== undefined && value !== '') {
          formData.append(field, String(value));
        }
      });

      const response = await fetch(`/api/company/profile?companyId=${companyId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update profile');
      router.push('/company/profile');
    } catch (err: any) {
      setError(err.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error && !profile) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!profile) return <div className="p-4">No profile found</div>;

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-black">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">プロフィール編集</h1>
        <Link href="/company/profile" className="text-sm text-indigo-600 hover:underline">戻る</Link>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">基本情報</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">会社ロゴ</label>
                <div className="flex items-center gap-4">
                  {profile.companyLogo && (
                    <div className="w-20 h-20 bg-gray-100 rounded border border-slate-300 flex items-center justify-center overflow-hidden">
                      <img 
                        src={profile.companyLogo} 
                        alt="Company logo" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    name="logoFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block text-sm text-slate-700 file:mr-4 file:py-2 file:px-3 file:border file:border-slate-300 file:rounded file:text-slate-700 file:bg-slate-50 hover:file:bg-slate-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">概要</label>
                <textarea
                  name="overview"
                  value={profile.overview || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">設立年</label>
                  <select
                    name="foundedYear"
                    value={profile.foundedYear || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  >
                    <option value="">選択してください</option>
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}年
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">資本金</label>
                  <input
                    type="text"
                    name="capital"
                    value={profile.capital || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">従業員数</label>
                  <input
                    type="number"
                    name="employees"
                    value={profile.employees || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">代表者</label>
                  <input
                    type="text"
                    name="representative"
                    value={profile.representative || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">本社</label>
                <input
                  type="text"
                  name="headquarters"
                  value={profile.headquarters || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Recruitment Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">採用情報</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">採用タイプ</label>
                <input
                  type="text"
                  name="recruitmentTypes"
                  value={profile.recruitmentTypes || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">採用ターゲット</label>
                <textarea
                  name="recruitmentTarget"
                  value={profile.recruitmentTarget || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">雇用形態</label>
                  <input
                    type="text"
                    name="employmentType"
                    value={profile.employmentType || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">勤務地</label>
                  <input
                    type="text"
                    name="workLocation"
                    value={profile.workLocation || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">勤務時間</label>
                <input
                  type="text"
                  name="workingHours"
                  value={profile.workingHours || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Salary & Benefits */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">給与・福利厚生</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">初年度給与</label>
                  <input
                    type="text"
                    name="initialSalary"
                    value={profile.initialSalary || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">年間給与</label>
                  <input
                    type="text"
                    name="annualSalary"
                    value={profile.annualSalary || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">ボーナス</label>
                <textarea
                  name="bonusInfo"
                  value={profile.bonusInfo || ''}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">福利厚生</label>
                <textarea
                  name="benefits"
                  value={profile.benefits || ''}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">社会保険</label>
                  <input
                    type="text"
                    name="socialInsurance"
                    value={profile.socialInsurance || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">住宅手当</label>
                  <input
                    type="text"
                    name="housingAllowance"
                    value={profile.housingAllowance || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">交通費</label>
                  <input
                    type="text"
                    name="transportationAllowance"
                    value={profile.transportationAllowance || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">研修</label>
                  <input
                    type="text"
                    name="training"
                    value={profile.training || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">資格取得支援</label>
                <textarea
                  name="certificateSupport"
                  value={profile.certificateSupport || ''}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Work Environment */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">職場環境</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">平均年齢</label>
                  <input
                    type="text"
                    name="avgAge"
                    value={profile.avgAge || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">性別構成</label>
                  <input
                    type="text"
                    name="genderRatio"
                    value={profile.genderRatio || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">平均残業時間</label>
                  <input
                    type="text"
                    name="overtimeHours"
                    value={profile.overtimeHours || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">有給休暇取得率</label>
                  <input
                    type="text"
                    name="vacationRate"
                    value={profile.vacationRate || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">リモート柔軟</label>
                <textarea
                  name="remoteFlexible"
                  value={profile.remoteFlexible || ''}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Foreign Hiring */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">海外採用</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">外国人採用実績</label>
                <textarea
                  name="foreignerHiringRecord"
                  value={profile.foreignerHiringRecord || ''}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">ビザサポート</label>
                <textarea
                  name="visaSupport"
                  value={profile.visaSupport || ''}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">社内言語</label>
                  <input
                    type="text"
                    name="internalLanguage"
                    value={profile.internalLanguage || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">日本語レベル</label>
                  <input
                    type="text"
                    name="japaneseLevel"
                    value={profile.japaneseLevel || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">受け入れ国籍</label>
                  <textarea
                    name="acceptedNationality"
                    value={profile.acceptedNationality || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">生活支援</label>
                  <textarea
                    name="livingSupport"
                    value={profile.livingSupport || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? '保存中...' : '保存する'}
            </button>
            <Link href="/company/profile" className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
