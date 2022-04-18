import * as React from 'react'
import {savePost} from './api'

export function Editor({user}) {
  const [saveState, setSaveState] = React.useState({
    status: false,
    error: null,
  })

  function handleSubmit(e) {
    e.preventDefault()
    const {title, content, tags} = e.target.elements
    setSaveState((curState) => ({...curState, status: 'loading'}))
    savePost({
      title: title.value,
      content: content.value,
      tags: tags.value.split(',').map((tag) => tag.trim()),
      id: user.id,
    })
      .then(() => {
        setSaveState((curState) => ({...curState, status: 'success'}))
      })
      .catch((error) => {
        console.log(error)
        setSaveState((curState) => ({...curState, status: 'error', error}))
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title-input">Title</label>
      <input id="title-input" name="title" />
      <label htmlFor="content-input">Content</label>
      <textarea id="content-input" name="content" />
      <label htmlFor="tags-input">Tags</label>
      <input id="tags-input" name="tags" />
      <button type="submit" disabled={saveState.status === 'loading'}>
        Submit
      </button>
      {saveState.status === 'error' && (
        <div role="alert">{`${saveState.error?.message}`}</div>
      )}
    </form>
  )
}
