import { fauna } from "../../../services/fauna";
import { query as q } from 'faunadb';
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
) {
  // This function will be able to save the subscription on DB

  // Buscar o usuario no BD com o customerID
  const userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  }

  if (createAction) {
     // Se estamos criando uma nova subscription, eu vou
     // salvar os dados da subscription no BD
    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        { data: subscriptionData }
      )
    )
  } else {
    // Se eu não estou criando, eu atualizo a subscription
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index('subscription_by_id'),
              subscription.id,
            )
          )
        ),
        { data: subscriptionData }
      )
    )
  }
}
