export interface Category {
  id?: string;
  name: string;
  description?: string;
  astrologersCount?: number;
  status?: Boolean;
  order?: number;
}


export interface Astrologer {
  id?: string;
  name: string;
  categoryId: string;
  category?: Category;
  profilePic: string;
  mobile: string;
  userId?: string;
  password?: string;
  expertise: string[];
  languages: string;
  experienceInYear: number;
  ratePerMinute: number;
  description: string;
  AstroKyc?: AstroKyc;
}

export interface AstroKyc {
  id: string;
  astroId: string;
  panCard: string;
  aadhar: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
}


export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  joinedDate: string;
}