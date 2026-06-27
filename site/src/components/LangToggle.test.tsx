import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LanguageProvider } from '../i18n/LanguageContext'
import { useContent } from '../i18n/useContent'
import { LangToggle } from './LangToggle'

function Probe() {
  return <span>{useContent().hero.ctaPrimary}</span>
}

describe('LangToggle', () => {
  it('switches content language when toggled', async () => {
    render(
      <LanguageProvider>
        <LangToggle />
        <Probe />
      </LanguageProvider>,
    )
    expect(screen.getByText('Get Started')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /中文|中/ }))
    expect(screen.getByText('快速开始')).toBeInTheDocument()
  })
})
