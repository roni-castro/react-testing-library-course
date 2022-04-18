import 'whatwg-fetch'
import * as React from 'react'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {Editor} from '../post-editor-03-api-msw'

const fakeUser = {id: 'fake-id'}

const server = setupServer(
  rest.post(`/post/${fakeUser.id}`, (req, res, ctx) => {
    if (
      req.body.title &&
      req.body.content &&
      req.body.tags.filter((t) => t).length > 0
    )
      return res(ctx.json({}))

    return res(ctx.status(400), ctx.json({message: 'Invalid params'}))
  }),
)

beforeAll(() => server.listen({onUnhandledRequest: 'error'}))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders a form with title, content, tags, and a submit button', async () => {
  const formData = {
    title: 'Title',
    content: 'Content',
    tags: 'Tags, Tags2',
    id: fakeUser.id,
  }
  render(<Editor user={fakeUser} />)
  screen.getByLabelText(/title/i).value = formData.title
  screen.getByLabelText(/content/i).value = formData.content
  screen.getByLabelText(/tags/i).value = formData.tags

  const submitButton = screen.getByText(/submit/i)

  userEvent.click(submitButton)
  expect(submitButton).toBeDisabled()

  await waitFor(() => expect(submitButton).toBeEnabled())
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})
