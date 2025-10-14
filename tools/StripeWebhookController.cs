using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Stripe;

// Place this file in an ASP.NET Core project (Controllers folder).
// Don't forget to add Stripe.net package: dotnet add package Stripe.net

namespace Brainova.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StripeWebhookController : ControllerBase
    {
        private readonly ILogger<StripeWebhookController> _logger;

        public StripeWebhookController(ILogger<StripeWebhookController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var sigHeader = Request.Headers["Stripe-Signature"]; // stripe-signature header
            var webhookSecret = Environment.GetEnvironmentVariable("STRIPE_WEBHOOK_SECRET");

            if (string.IsNullOrEmpty(webhookSecret))
            {
                _logger.LogError("STRIPE_WEBHOOK_SECRET is not configured in environment");
                return StatusCode(500, "Webhook secret not configured");
            }

            Event stripeEvent;
            try
            {
                stripeEvent = EventUtility.ConstructEvent(json, sigHeader, webhookSecret);
            }
            catch (StripeException e)
            {
                _logger.LogWarning(e, "Webhook signature verification failed");
                return BadRequest();
            }

            try
            {
                if (stripeEvent.Type == Events.CheckoutSessionCompleted)
                {
                    var session = stripeEvent.Data.Object as Session;
                    _logger.LogInformation("checkout.session.completed received: {SessionId}", session?.Id);

                    // Example: extract useful values
                    var metadata = session?.Metadata ?? new System.Collections.Generic.Dictionary<string, string>();
                    var row = new
                    {
                        session_id = session?.Id,
                        customer_email = session?.CustomerDetails?.Email ?? (metadata.ContainsKey("user_email") ? metadata["user_email"] : null),
                        metadata = metadata,
                        game_id = metadata.ContainsKey("game_id") ? metadata["game_id"] : null,
                        amount_total = session?.AmountTotal,
                        payment_status = session?.PaymentStatus,
                        created_at = DateTime.UtcNow
                    };

                    // TODO: Persist `row` into your DB (Supabase, PostgreSQL, etc.).
                    // Use an idempotent upsert by session_id to avoid duplicates.
                    // Example: call your service here.

                    _logger.LogInformation("Processed session {SessionId} metadata: {Metadata}", session?.Id, metadata);
                }
                else
                {
                    _logger.LogInformation("Unhandled event type: {EventType}", stripeEvent.Type);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error handling webhook event");
                return StatusCode(500);
            }

            return Ok();
        }
    }
}
