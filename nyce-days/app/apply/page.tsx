import { redirect } from 'next/navigation'

// /apply is the short, memorable link — send it to the casting form.
export default function ApplyPage() {
  redirect('/casting')
}
