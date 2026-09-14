import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'

describe('Gatherfold workbench', () => {
  it('renders a complete book with a clean preflight report', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Field Notes on Rain', level: 1 })).toBeInTheDocument()
    expect(screen.getByText('64 pp.')).toBeInTheDocument()
    expect(screen.getByText('Ready to fold')).toBeInTheDocument()
    expect(screen.getByText('64 assignments · 64 expected pages')).toBeInTheDocument()
  })

  it('switches book projects and resets the active signature', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /The Night Orchard/ }))
    expect(screen.getByRole('heading', { name: 'The Night Orchard', level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'A · Threshold', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Page 16' })).toBeInTheDocument()
  })

  it('changes the canvas from both sides to back sides only', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getAllByRole('region', { name: 'front side' })).toHaveLength(4)
    expect(screen.getAllByRole('region', { name: 'back side' })).toHaveLength(4)
    await user.click(screen.getByRole('button', { name: 'back' }))
    expect(screen.queryAllByRole('region', { name: 'front side' })).toHaveLength(0)
    expect(screen.getAllByRole('region', { name: 'back side' })).toHaveLength(4)
  })

  it('edits an assignment and exposes missing and repeated pages', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('Page number')
    await user.clear(input)
    await user.type(input, '15')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    expect(screen.getByRole('heading', { name: 'Page 15' })).toBeInTheDocument()
    expect(screen.getByText('2 conflicts')).toBeInTheDocument()
    expect(screen.getByText('Missing:').closest('li')).toHaveTextContent('Missing: 16')
    expect(screen.getByText('Repeated:').closest('li')).toHaveTextContent('Repeated: 15')
  })

  it('undoes and redoes a page edit', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('Page number')
    await user.clear(input)
    await user.type(input, '15')
    await user.click(screen.getByRole('button', { name: 'Apply' }))
    await user.click(screen.getByRole('button', { name: 'Undo last change' }))
    expect(screen.getByRole('heading', { name: 'Page 16' })).toBeInTheDocument()
    expect(screen.getByText('Ready to fold')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Redo last change' }))
    expect(screen.getByRole('heading', { name: 'Page 15' })).toBeInTheDocument()
  })

  it('locates a page in another signature and selects its slot', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText('Find a page'), '33')
    await user.click(screen.getByRole('button', { name: 'Locate' }))
    expect(screen.getByRole('heading', { name: 'C · River gauges', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Page 33' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Page 33, front side/ })).toHaveAttribute('aria-pressed', 'true')
  })

  it('moves the selected physical sheet and can undo the order change', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByText('01 of 4')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '↓ Move inward' }))
    expect(screen.getByText('02 of 4')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Undo last change' }))
    expect(screen.getByText('01 of 4')).toBeInTheDocument()
  })

  it('toggles textual proof status for a signature', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByText('2 of 4 signatures proofed')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '✓ Signature proofed' }))
    expect(screen.getByRole('button', { name: 'Mark signature proofed' })).toBeInTheDocument()
    expect(screen.getByText('1 of 4 signatures proofed')).toBeInTheDocument()
  })

  it('adds a fully imposed signature and extends the book', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Add signature' }))
    const dialog = screen.getByRole('dialog', { name: 'Add a 16-page signature' })
    await user.type(within(dialog).getByLabelText('Signature label'), 'E · Appendix')
    await user.selectOptions(within(dialog).getByLabelText('Paper stock'), 'Warm grey')
    await user.type(within(dialog).getByLabelText('Binder note'), 'Trim after the colour plate.')
    await user.click(within(dialog).getByRole('button', { name: 'Add signature' }))
    expect(screen.getByRole('heading', { name: 'E · Appendix', level: 2 })).toBeInTheDocument()
    expect(screen.getByText('80 pp.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Page 80' })).toBeInTheDocument()
    expect(screen.getByText('80 assignments · 80 expected pages')).toBeInTheDocument()
  })

  it('closes the add-signature dialog with Escape and restores focus', async () => {
    const user = userEvent.setup()
    render(<App />)
    const trigger = screen.getByRole('button', { name: 'Add signature' })

    await user.click(trigger)
    expect(screen.getByLabelText('Signature label')).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Add a 16-page signature' })).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
