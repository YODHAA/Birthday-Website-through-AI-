export function calculateDaysUntil(month: number, day: number): number {
  const now = new Date();
  const currentYear = now.getFullYear();
  
  let targetDate = new Date(currentYear, month - 1, day);
  
  // Set times to midnight for clean comparison
  const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetZero = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  
  let diffTime = targetZero.getTime() - todayZero.getTime();
  let diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    // Birthday has passed this year, look to next year
    targetDate = new Date(currentYear + 1, month - 1, day);
    diffTime = targetDate.getTime() - todayZero.getTime();
    diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  }
  
  return diffDays;
}

export function calculateAge(month: number, day: number, year: number | null): { turningAge: number | null; isToday: boolean } {
  if (!year) return { turningAge: null, isToday: false };
  
  const now = new Date();
  const currentYear = now.getFullYear();
  let age = currentYear - year;
  
  const targetDate = new Date(currentYear, month - 1, day);
  const todayZero = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetZero = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  
  const diffTime = targetZero.getTime() - todayZero.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  const isToday = diffDays === 0;
  if (diffDays < 0) {
    age += 1;
  }
  
  return { turningAge: age, isToday };
}

export function formatBirthdayDate(month: number, day: number, year: number | null): string {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[month - 1] || 'Jan';
  if (year) {
    return `${monthName} ${day}, ${year}`;
  }
  return `${monthName} ${day}`;
}

export function getCategoryStyles(category: string): { bg: string; text: string; border: string } {
  switch (category) {
    case 'FAMILY':
      return { bg: 'bg-[#FFE4E6]', text: 'text-[#BE123C]', border: 'border-[#FECDD3]' };
    case 'FRIENDS':
      return { bg: 'bg-[#E0F2FE]', text: 'text-[#0369A1]', border: 'border-[#BAE6FD]' };
    case 'COLLEAGUES':
      return { bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]', border: 'border-[#FDE68A]' };
    default:
      return { bg: 'bg-[#F3E8FF]', text: 'text-[#6B21A8]', border: 'border-[#E9D5FF]' };
  }
}
