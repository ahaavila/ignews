import { signIn, useSession } from 'next-auth/client';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import styles from './styles.module.scss';

interface subscribeButtonProps {
  priceId: string;
}
export function SubscribeButton({ priceId }: subscribeButtonProps) {
  const [session] = useSession();

  async function handleSubscribe() {
    // If the user is not logged, I redirect him to Signin page
    if(!session) {
      signIn('github');
      return;
    }

    // Checkout session creation
    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({ sessionId });

    } catch (error) {
      alert(error.message);
    }
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
