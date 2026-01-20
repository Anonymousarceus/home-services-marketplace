const Provider = require('../models/Provider');

// Get all providers
exports.getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.getAll();
    res.json({ providers });
  } catch (error) {
    console.error('Error fetching providers:', error);
    res.status(500).json({ error: 'Failed to fetch providers' });
  }
};

// Get provider by ID
exports.getProviderById = async (req, res) => {
  try {
    const provider = await Provider.getById(req.params.id);
    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }
    res.json({ provider });
  } catch (error) {
    console.error('Error fetching provider:', error);
    res.status(500).json({ error: 'Failed to fetch provider' });
  }
};

// Update provider availability
exports.updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;

    const result = await Provider.updateAvailability(id, available);
    res.json({ 
      message: 'Availability updated successfully',
      ...result 
    });
  } catch (error) {
    console.error('Error updating availability:', error);
    res.status(500).json({ error: 'Failed to update availability' });
  }
};
