import Express from 'express'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './App'

const ABORT_DELAY = 10_000

const log = (...args: unknown[]) => {
  console.log(new Date(), ...args)
}

export function renderStream({ res, head }: { res: Express.Response, head: string | TrustedHTML }) {
  const { pipe, abort } = ReactDOMServer.renderToPipeableStream(
    <React.StrictMode>
      <App head={head} />
    </React.StrictMode>,
    {
      onAllReady() {
        log('onAllReady')
      },
      onShellReady() {
        log('onShellReady')
        res.statusCode = 200
        res.setHeader("Content-type", "text/html")
        pipe(res)
      },
      onShellError(e) {
        const error = e as Error
        res.statusCode = 500
        res.send(
          `<!doctype html><p>An error ocurred:</p><pre>${error.message}</pre>`
        )
      },
    }
  )

  // Abandon and switch to client rendering if enough time passes.
  // Try lowering this to see the client recover.
  setTimeout(abort, ABORT_DELAY)
}
