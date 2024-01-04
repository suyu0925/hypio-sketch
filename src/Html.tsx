import { PropsWithChildren } from 'react'

type HtmlProps = PropsWithChildren<{
  head?: string | TrustedHTML
}>

const Html = ({ children, head }: HtmlProps) => {
  return (
    <html>
      <head dangerouslySetInnerHTML={head ? { __html: head } : undefined}></head>
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<b>Enable JavaScript to run this app.</b>`,
          }}
        />
        {children}
        {/*
         * TODO: Fix Vite upstream to allow this tag to be injected via `bootstrapModules` in `pipeToWritableStream` instead.
         * Currently, it breaks the JSX Runtime.
         */}
        {import.meta.env.DEV && (
          <script type="module" src="/src/entry-client.tsx"></script>
        )}
      </body>
    </html>
  )
}

export default Html
