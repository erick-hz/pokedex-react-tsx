import { render, screen } from '@testing-library/react';

import ResumeFormSection from './ResumeFormSection';

describe('ResumeFormSection', () => {
  it('uses the heading as the region accessible name when ariaLabel is not provided', () => {
    render(
      <ResumeFormSection title="Languages">
        <div>Body content</div>
      </ResumeFormSection>,
    );

    expect(screen.getByRole('region', { name: 'Languages' })).toBeInTheDocument();
  });

  it('uses ariaLabel as the region accessible name when provided', () => {
    render(
      <ResumeFormSection title="Languages" ariaLabel="Custom section label">
        <div>Body content</div>
      </ResumeFormSection>,
    );

    expect(
      screen.getByRole('region', {
        name: 'Custom section label',
      }),
    ).toBeInTheDocument();
  });

  it('falls back to the heading when ariaLabel is empty or whitespace', () => {
    render(
      <ResumeFormSection title="Languages" ariaLabel="   ">
        <div>Body content</div>
      </ResumeFormSection>,
    );

    expect(screen.getByRole('region', { name: 'Languages' })).toBeInTheDocument();
  });
});
