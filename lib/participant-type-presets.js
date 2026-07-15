/**
 * Preset registrant types, mirroring the legacy Event Registration Tool.
 * Names are localized jsonb values stored as-is on participant_types.name.
 */
export const PARTICIPANT_TYPE_PRESETS = [
  {
    key: 'child',
    name: { en: 'Child', es: 'Niño/a', fr: 'Enfant', ru: 'Ребёнок', uk: 'Дитина' },
  },
  {
    key: 'commuter',
    name: { en: 'Commuter', es: 'Viajero diario', fr: 'Navetteur', ru: 'Приходящий участник', uk: 'Приїжджий учасник' },
  },
  {
    key: 'couple',
    name: { en: 'Couple', es: 'Pareja', fr: 'Couple', ru: 'Супружеская пара', uk: 'Подружжя' },
  },
  {
    key: 'day_pass',
    name: { en: 'Day-Pass Attendee', es: 'Asistente por día', fr: 'Participant à la journée', ru: 'Участник на один день', uk: 'Учасник на один день' },
  },
  {
    key: 'guest',
    name: { en: 'Guest', es: 'Invitado/a', fr: 'Invité(e)', ru: 'Гость', uk: 'Гість' },
  },
  {
    key: 'high_school',
    name: { en: 'High School Only', es: 'Solo secundaria', fr: 'Lycéens uniquement', ru: 'Только старшеклассники', uk: 'Лише старшокласники' },
  },
  {
    key: 'partner',
    name: { en: 'Partner', es: 'Socio/a', fr: 'Partenaire', ru: 'Партнёр', uk: 'Партнер' },
  },
  {
    key: 'spouse',
    name: { en: 'Spouse', es: 'Cónyuge', fr: 'Conjoint(e)', ru: 'Супруг(а)', uk: 'Чоловік/дружина' },
  },
  {
    key: 'staff',
    name: { en: 'Staff Member / Intern', es: 'Personal / Practicante', fr: 'Employé / Stagiaire', ru: 'Сотрудник / Стажёр', uk: 'Співробітник / Стажер' },
  },
  {
    key: 'student',
    name: { en: 'Student', es: 'Estudiante', fr: 'Étudiant(e)', ru: 'Студент', uk: 'Студент' },
  },
  {
    key: 'student_adult',
    name: { en: 'Student - Age 18 or Older', es: 'Estudiante - 18 años o más', fr: 'Étudiant(e) - 18 ans ou plus', ru: 'Студент - 18 лет и старше', uk: 'Студент - 18 років і старше' },
  },
  {
    key: 'student_minor',
    name: { en: 'Student - Under Age 18', es: 'Estudiante - menor de 18 años', fr: 'Étudiant(e) - moins de 18 ans', ru: 'Студент - младше 18 лет', uk: 'Студент - до 18 років' },
  },
  {
    key: 'vendor',
    name: { en: 'Vendor', es: 'Vendedor/a', fr: 'Exposant', ru: 'Поставщик', uk: 'Постачальник' },
  },
  {
    key: 'visitor',
    name: { en: 'Visitor', es: 'Visitante', fr: 'Visiteur', ru: 'Посетитель', uk: 'Відвідувач' },
  },
  {
    key: 'volunteer',
    name: { en: 'Volunteer', es: 'Voluntario/a', fr: 'Bénévole', ru: 'Волонтёр', uk: 'Волонтер' },
  },
]

export const DEFAULT_PARTICIPANT_TYPE = {
  key: 'participant',
  name: { en: 'Participant', es: 'Participante', fr: 'Participant(e)', ru: 'Участник', uk: 'Учасник' },
}

/** Return a key unique among existing keys: 'guest', 'guest_2', 'guest_3', … */
export function uniqueTypeKey(baseKey, existingKeys) {
  const taken = new Set(existingKeys)
  if (!taken.has(baseKey)) return baseKey
  let n = 2
  while (taken.has(`${baseKey}_${n}`)) n++
  return `${baseKey}_${n}`
}
