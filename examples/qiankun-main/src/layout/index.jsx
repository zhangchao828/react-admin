export default function Layout({ children, location: { pathname } }) {
  if (pathname.startsWith('/demo')) {
    return <div id="demo" />
  }
  return <div>{children}</div>
}
