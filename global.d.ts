declare module '*.less' {
  const content: any
  export default content
}
declare module '*.css' {
  const content: any
  export default content
}
declare const __ENV__: 'dev' | 'pre' | 'pro' | string

interface Window {}
