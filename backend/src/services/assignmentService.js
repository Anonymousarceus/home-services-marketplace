const Booking = require('../models/Booking');
const Provider = require('../models/Provider');

// Auto-assignment with retry logic
async function assignProviderWithRetry(bookingId, serviceType, maxRetries = 3, currentAttempt = 1) {
  try {
    console.log(`Attempting to assign provider for booking ${bookingId} (attempt ${currentAttempt}/${maxRetries})`);

    // Get available providers for this service type
    const providers = await Provider.getAvailableForService(serviceType);

    if (providers.length === 0) {
      if (currentAttempt < maxRetries) {
        // Exponential backoff: wait before retrying
        const delay = Math.pow(2, currentAttempt) * 1000; // 2s, 4s, 8s
        console.log(`No available providers, retrying in ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return assignProviderWithRetry(bookingId, serviceType, maxRetries, currentAttempt + 1);
      } else {
        throw new Error('No available providers after all retry attempts');
      }
    }

    // Simple assignment strategy: pick the highest-rated available provider
    const selectedProvider = providers[0];

    // Assign the provider
    await Booking.assignProvider(
      bookingId, 
      selectedProvider.id, 
      'system',
      `Auto-assigned (attempt ${currentAttempt})`
    );

    console.log(`Successfully assigned provider ${selectedProvider.id} to booking ${bookingId}`);
    return { bookingId, providerId: selectedProvider.id };

  } catch (error) {
    console.error(`Error in provider assignment (attempt ${currentAttempt}):`, error);
    
    if (currentAttempt < maxRetries) {
      const delay = Math.pow(2, currentAttempt) * 1000;
      console.log(`Retrying assignment in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return assignProviderWithRetry(bookingId, serviceType, maxRetries, currentAttempt + 1);
    } else {
      throw error;
    }
  }
}

module.exports = {
  assignProviderWithRetry
};
