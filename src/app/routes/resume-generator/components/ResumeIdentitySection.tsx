import type { ResumeGeneratorModel } from '../useResumeGeneratorModel';
import { useTranslation } from 'react-i18next';
import { FIELD_LIMITS } from '../useResumeGeneratorModel';

type ResumeIdentitySectionProps = Pick<
  ResumeGeneratorModel,
  | 'fullName'
  | 'setFullName'
  | 'headline'
  | 'setHeadline'
  | 'cityCountry'
  | 'setCityCountry'
  | 'phone'
  | 'setPhone'
  | 'email'
  | 'setEmail'
>;

export function ResumeIdentitySection({
  fullName,
  setFullName,
  headline,
  setHeadline,
  cityCountry,
  setCityCountry,
  phone,
  setPhone,
  email,
  setEmail,
}: ResumeIdentitySectionProps) {
  const { t } = useTranslation();

  return (
    <div className="resume-form-grid">
      <label>
        {t('resumeGenerator.fields.fullName')}
        <input
          maxLength={FIELD_LIMITS.fullName}
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />
      </label>
      <label>
        {t('resumeGenerator.fields.headline')}
        <input
          maxLength={FIELD_LIMITS.headline}
          value={headline}
          onChange={(event) => setHeadline(event.target.value)}
        />
      </label>
      <label>
        {t('resumeGenerator.fields.cityCountry')}
        <input
          maxLength={FIELD_LIMITS.cityCountry}
          value={cityCountry}
          onChange={(event) => setCityCountry(event.target.value)}
        />
      </label>
      <label>
        {t('resumeGenerator.fields.phone')}
        <input
          maxLength={FIELD_LIMITS.phone}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </label>
      <label className="resume-form-grid-full">
        {t('resumeGenerator.fields.email')}
        <input
          maxLength={FIELD_LIMITS.email}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
    </div>
  );
}
