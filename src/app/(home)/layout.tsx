interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex max-h-screen min-h-screen flex-col">
      <div className="-z-10 absolute inset-0 h-full w-full bg-[radial-gradient(#dadde2_1px,transparent_1px)] bg-background [background-size:16px_16px] dark:bg-[radial-gradient(#393e4a_1px,transparent_1px)]" />
      <div className="flex flex-1 flex-col px-4 pb-4">{children}</div>
    </main>
  )
}

export default Layout
