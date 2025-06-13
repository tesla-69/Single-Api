require('dotenv').config();
const express = require('express');
const app = express();
const campaignRoutes = require('./routes1/campaign');
const csvRoutes = require('./campaign-sender/routes/csvCampaign');
const paymentWebhook = require('./routes1/paymentWebhook');

app.use(express.json());
app.use('/api', campaignRoutes);

app.use('/api', paymentWebhook);

app.use('/api', csvRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
