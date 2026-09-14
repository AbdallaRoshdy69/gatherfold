import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PageFinder } from './PageFinder.jsx'

describe('PageFinder', () => {
  it('reports values outside the current book extent', async () => {
    const user = userEvent.setup()
    const onFind = vi.fn()
    render(<PageFinder totalPages={64} onFind={onFind} />)

    await user.type(screen.getByLabelText('Find a page'), '65')
    await user.click(screen.getByRole('button', { name: 'Locate' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a whole page number from 1 to 64.')
    expect(screen.getByLabelText('Find a page')).toHaveAttribute('aria-invalid', 'true')
    expect(onFind).not.toHaveBeenCalled()
  })

  it('distinguishes a valid but unassigned page', async () => {
    const user = userEvent.setup()
    render(<PageFinder totalPages={64} onFind={() => false} />)

    await user.type(screen.getByLabelText('Find a page'), '12')
    await user.click(screen.getByRole('button', { name: 'Locate' }))

    expect(screen.getByRole('alert')).toHaveTextContent('That page is not assigned.')
  })
})
