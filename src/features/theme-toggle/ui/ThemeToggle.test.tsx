import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import ThemeToggle from '@features/theme-toggle/ui/ThemeToggle';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (_key: string, fallback: string) => fallback,
  }),
}));

describe('ThemeToggle', () => {
  it('renders as an accessible switch and toggles on click', () => {
    const onToggle = vi.fn();

    render(<ThemeToggle isDarkMode={false} onToggle={onToggle} />);

    const control = screen.getByRole('switch', { name: 'Dark mode' });

    expect(control).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(control);

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('shows light mode label when dark mode is active', () => {
    render(<ThemeToggle isDarkMode={true} onToggle={vi.fn()} />);

    expect(screen.getByRole('switch', { name: 'Light mode' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });
});
