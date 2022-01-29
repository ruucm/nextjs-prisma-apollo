import { getCsrfToken, signIn } from 'next-auth/client'
import { useForm } from 'react-hook-form'

export default function SignIn({ csrfToken }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  return (
    <div>
      <form
        onSubmit={handleSubmit(({ email }) => {
          signIn('email', { email })
        })}
      >
        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

        <span>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email adress"
            {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
          />
          <button type="submit">Log In</button>
        </span>
      </form>
    </div>
  )
}

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context)
  return {
    props: { csrfToken },
  }
}
