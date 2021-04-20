import { signIn, useSession } from 'next-auth/client';
import styles from './styles.module.scss';

interface subscribeButtonProps {
  priceId: string;
}
export function SubscribeButton({ priceId }: subscribeButtonProps) {
  const [session] = useSession();

  function handleSubscribe() {
    // If the user is not logged, I redirect him to Signin page
    if(!session) {
      signIn('github');
      return;
    }

    // Checkout session creation

  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
