// trang chủ
import Link from 'next/link'

type Props = {}

export default function page({ }: Props) {
  return (
    <>
      < Link href="/login">Login</Link >
      <br />

      <Link href="/register">Register</Link>
    </>
  )
}