import { Document, Font, Link as PdfLink, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';

import type {
  ResumeEducation,
  ResumeExperience,
  ResumeLink,
  ResumeSkill,
} from '../useResumeGeneratorModel';
import { groupByPairs } from '../useResumeGeneratorModel';

type ResumePdfDocumentProps = {
  fullName: string;
  headline: string;
  cityCountry: string;
  phone: string;
  email: string;
  links: ResumeLink[];
  experiences: ResumeExperience[];
  skills: ResumeSkill[];
  languages: string[];
  hobbies: string;
  education: ResumeEducation[];
};

Font.registerHyphenationCallback((word) => [word]);

const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 11,
    color: '#1f1f1f',
    paddingTop: 34,
    paddingRight: 36,
    paddingBottom: 34,
    paddingLeft: 36,
    lineHeight: 1.3,
  },
  header: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  headerTitle: {
    fontFamily: 'Times-Bold',
    fontSize: 24,
    lineHeight: 1.15,
    textAlign: 'center',
  },
  headerMeta: {
    fontSize: 10.8,
    marginTop: 14,
    textAlign: 'center',
  },
  linksSection: {
    marginTop: 2,
    borderTopWidth: 1.1,
    borderTopColor: '#595959',
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    gap: 14,
  },
  linksTitle: {
    width: 150,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  linksBody: {
    flex: 1,
    minWidth: 0,
  },
  section: {
    marginTop: 14,
    paddingTop: 8,
    borderTopWidth: 1.1,
    borderTopColor: '#595959',
    flexDirection: 'row',
    gap: 14,
  },
  sectionTitle: {
    width: 150,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  employmentSection: {
    marginTop: 14,
    paddingTop: 8,
    borderTopWidth: 1.1,
    borderTopColor: '#595959',
    gap: 10,
  },
  employmentTitle: {
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  employmentBody: {
    gap: 12,
  },
  sectionBody: {
    flex: 1,
    minWidth: 0,
  },
  linksText: {
    fontSize: 11,
  },
  link: {
    color: '#2f3f8c',
    textDecoration: 'underline',
  },
  columnGap: {
    gap: 12,
  },
  jobEntry: {
    gap: 4,
  },
  jobHeading: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  jobDate: {
    width: 150,
    color: '#333333',
  },
  jobRole: {
    flex: 1,
    fontWeight: 700,
    paddingRight: 8,
  },
  jobLocation: {
    width: 150,
    textAlign: 'right',
  },
  bulletList: {
    marginTop: 2,
    marginLeft: 162,
    gap: 3,
  },
  bullet: {
    fontSize: 11,
    paddingRight: 4,
  },
  skillGrid: {
    gap: 6,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 24,
  },
  skillName: {
    flex: 1,
    paddingRight: 8,
  },
  languageGrid: {
    gap: 6,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 12,
  },
  languageCell: {
    flex: 1,
  },
  educationRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  educationDate: {
    width: 150,
    color: '#333333',
    textAlign: 'center',
  },
  educationBody: {
    flex: 1,
    gap: 2,
    paddingRight: 8,
  },
  educationInstitution: {
    fontWeight: 700,
  },
});

export function ResumePdfDocument({
  fullName,
  headline,
  cityCountry,
  phone,
  email,
  links,
  experiences,
  skills,
  languages,
  hobbies,
  education,
}: ResumePdfDocumentProps) {
  const { t } = useTranslation();
  const visibleLinks = links.filter((link) => link.label.trim() || link.url.trim());
  const visibleSkillNames = skills.map((skill) => skill.name.trim()).filter(Boolean);
  const skillRows = groupByPairs(visibleSkillNames);
  const visibleLanguages = languages.filter((language) => language.trim());
  const languageRows = groupByPairs(visibleLanguages);

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.headerTitle}>
            {fullName || t('resumeGenerator.pdf.fallbackName')}
            {headline ? ` - ${headline}` : ''}
          </Text>
          <Text style={pdfStyles.headerMeta}>
            {[cityCountry, phone, email].filter(Boolean).join(', ') ||
              t('resumeGenerator.pdf.fallbackMeta')}
          </Text>
        </View>

        <View style={pdfStyles.linksSection}>
          <Text style={pdfStyles.linksTitle}>{t('resumeGenerator.sections.links')}</Text>
          <View style={pdfStyles.linksBody}>
            <Text style={pdfStyles.linksText}>
              {visibleLinks.map((link, index) => (
                <Text key={link.id}>
                  <PdfLink src={link.url || '#'} style={pdfStyles.link}>
                    {link.label || link.url}
                  </PdfLink>
                  {index < visibleLinks.length - 1 ? ', ' : ''}
                </Text>
              ))}
            </Text>
          </View>
        </View>

        <View style={pdfStyles.employmentSection}>
          <Text style={pdfStyles.employmentTitle}>
            {t('resumeGenerator.sections.employmentHistory')}
          </Text>
          <View style={pdfStyles.employmentBody}>
            {experiences.map((experience) => (
              <View key={experience.id} style={pdfStyles.jobEntry}>
                <View style={pdfStyles.jobHeading}>
                  <Text style={pdfStyles.jobDate}>{experience.dateRange}</Text>
                  <Text style={pdfStyles.jobRole}>
                    {experience.role}
                    {experience.company ? `, ${experience.company}` : ''}
                  </Text>
                  <Text style={pdfStyles.jobLocation}>{experience.location}</Text>
                </View>

                <View style={pdfStyles.bulletList}>
                  {experience.bullets
                    .filter((bullet) => bullet.trim())
                    .map((bullet, index) => (
                      <Text key={`${experience.id}-${index}`} style={pdfStyles.bullet}>
                        {'\u2022'} {bullet}
                      </Text>
                    ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>{t('resumeGenerator.sections.skills')}</Text>
          <View style={[pdfStyles.sectionBody, pdfStyles.skillGrid]}>
            {skillRows.map((row, index) => (
              <View key={`skill-row-${index}`} style={pdfStyles.skillRow}>
                <Text style={pdfStyles.skillName}>{row[0] ?? ''}</Text>
                <Text style={pdfStyles.skillName}>{row[1] ?? ''}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>{t('resumeGenerator.sections.languages')}</Text>
          <View style={[pdfStyles.sectionBody, pdfStyles.languageGrid]}>
            {languageRows.map((row, index) => (
              <View key={`language-row-${index}`} style={pdfStyles.languageRow}>
                <Text style={pdfStyles.languageCell}>{row[0] ?? ''}</Text>
                <Text style={pdfStyles.languageCell}>{row[1] ?? ''}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>{t('resumeGenerator.sections.hobbies')}</Text>
          <View style={pdfStyles.sectionBody}>
            <Text>{hobbies}</Text>
          </View>
        </View>

        <View style={pdfStyles.section}>
          <Text style={pdfStyles.sectionTitle}>{t('resumeGenerator.sections.education')}</Text>
          <View style={[pdfStyles.sectionBody, pdfStyles.columnGap]}>
            {education.map((item) => (
              <View key={item.id} style={pdfStyles.educationRow}>
                <View style={pdfStyles.educationBody}>
                  <Text style={pdfStyles.educationInstitution}>{item.institution}</Text>
                  <Text>{item.degree}</Text>
                </View>
                <Text style={pdfStyles.educationDate}>{item.dateRange}</Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
