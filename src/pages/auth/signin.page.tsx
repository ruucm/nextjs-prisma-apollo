import { getCsrfToken, signIn } from 'next-auth/client'
import { useForm } from 'react-hook-form'
import _ from 'lodash'

export default function SignIn({ csrfToken }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const { email } = watch()

  return (
    <div className="flex-row">
      <form
        className="flex-col pt-12 pl-16"
        onSubmit={handleSubmit(({ email }) => {
          signIn('email', { email })
        })}
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        <div className="w-[12px] h-[12px] bg-black rounded-full" />
        <div className="h-5" />

        <span className="items-center flex-row">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email adress"
            {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
          />
          <span className="w-3" />
          <button type="submit">Log In</button>
        </span>
      </form>
    </div>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken },
  }
}

/*
// If older than Next.js 9.3
SignIn.getInitialProps = async (context) => {
  return {
    csrfToken: await getCsrfToken(context)
  }
}
*/
