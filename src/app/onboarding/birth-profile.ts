export function getBirthProfile(birthDate: string, today = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return null;

  const [year, month, day] = birthDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    year < 1900 ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date > today
  )
    return null;

  const birthdayPending =
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day);
  const age = today.getFullYear() - year - Number(birthdayPending);
  const ageGroup =
    age >= 60
      ? "60대 이상"
      : age < 10
        ? "10대 미만"
        : `${Math.floor(age / 10) * 10}대`;
  return { age, ageGroup };
}
