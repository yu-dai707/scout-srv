import { NextResponse } from 'next/server';
import { prisma } from 'src/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'logos');

// GET /api/company/profile - Fetch company profile
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId || isNaN(Number(companyId))) {
      return NextResponse.json(
        { error: 'Invalid companyId' },
        { status: 400 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { id: Number(companyId) },
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        city: true,
        website: true,
        companyLogo: true,
        overview: true,
        foundedYear: true,
        capital: true,
        employees: true,
        representative: true,
        headquarters: true,
        recruitmentTypes: true,
        recruitmentTarget: true,
        employmentType: true,
        workLocation: true,
        workingHours: true,
        initialSalary: true,
        annualSalary: true,
        bonusInfo: true,
        benefits: true,
        socialInsurance: true,
        housingAllowance: true,
        transportationAllowance: true,
        training: true,
        certificateSupport: true,
        avgAge: true,
        genderRatio: true,
        overtimeHours: true,
        vacationRate: true,
        remoteFlexible: true,
        foreignerHiringRecord: true,
        visaSupport: true,
        internalLanguage: true,
        japaneseLevel: true,
        acceptedNationality: true,
        livingSupport: true,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    console.error('Error fetching company profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company profile', details: String(error) },
      { status: 500 }
    );
  }
}

// PUT /api/company/profile - Update company profile
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('companyId');

  if (!companyId || isNaN(Number(companyId))) {
    return NextResponse.json(
      { error: 'Invalid companyId' },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();
    const logoFile = formData.get('companyLogo') as File | null;

    let logoPath: string | null = null;

    if (logoFile && logoFile.size > 0) {
      // ロゴファイル処理
      await mkdir(UPLOAD_DIR, { recursive: true });
      
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const ext = logoFile.name.split('.').pop() || 'jpg';
      const filename = `logo_${Number(companyId)}_${Date.now()}.${ext}`;
      const filepath = join(UPLOAD_DIR, filename);
      
      await writeFile(filepath, buffer);
      logoPath = `/uploads/logos/${filename}`;
    }

    // Allowed fields for update
    const allowedFields = [
      'overview',
      'foundedYear',
      'capital',
      'employees',
      'representative',
      'headquarters',
      'recruitmentTypes',
      'recruitmentTarget',
      'employmentType',
      'workLocation',
      'workingHours',
      'initialSalary',
      'annualSalary',
      'bonusInfo',
      'benefits',
      'socialInsurance',
      'housingAllowance',
      'transportationAllowance',
      'training',
      'certificateSupport',
      'avgAge',
      'genderRatio',
      'overtimeHours',
      'vacationRate',
      'remoteFlexible',
      'foreignerHiringRecord',
      'visaSupport',
      'internalLanguage',
      'japaneseLevel',
      'acceptedNationality',
      'livingSupport',
    ];

    const updateData: Record<string, any> = {};
    
    for (const field of allowedFields) {
      const value = formData.get(field);
      if (value !== null && value !== undefined && value !== '') {
        if (field === 'foundedYear' || field === 'employees') {
          updateData[field] = value ? Number(value) : null;
        } else {
          updateData[field] = value;
        }
      }
    }

    if (logoPath) {
      updateData.companyLogo = logoPath;
    }

    const company = await prisma.company.update({
      where: { id: Number(companyId) },
      data: updateData,
    });

    return NextResponse.json(company, { status: 200 });
  } catch (error) {
    console.error('Error updating company profile:', error);
    return NextResponse.json(
      { error: 'Failed to update company profile' },
      { status: 500 }
    );
  }
}
