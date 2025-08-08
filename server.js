import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import lead from './models/lead.js';
dotenv.config()

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json())

const connect = async () =>{
    try{
          mongoose.set('strictQuery', false);
          await mongoose.connect(process.env.DB_URI, {})
          console.log('Connected MongoDB!')
    }
    catch(error){
          throw error;
    }
};

mongoose.connection.on('disconnected', () =>{
    console.log('mpngoDb Disconnected!')
})

mongoose.connection.on('connected', () =>{
    console.log('mongoDb Connected!')
})


app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running!' });
});

app.get('/facebook/webhook', async(req, res) =>{
    const VERIFY_TOKEN = configEnv.fb_lead.verify_token

  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED')
      return parseInt(challenge)
    } else {
      throw new Error('Invalid verification token');
    }
  }
})

app.post('/facebook/webhook', async(req, res) =>{
  console.log('👉 Received Facebook webhook POST')
  console.log(JSON.stringify(req.body, null, 2))

  const entries = req.body.entry || []

  for (const entry of entries) {
    const changes = entry.changes || []

    for (const change of changes) {
      if (change.field === 'leadgen' && change.value?.leadgen_id) {
        const leadgenId = change.value.leadgen_id

        try {
          const url = `https://graph.facebook.com/v22.0/${leadgenId}`
          const headers = {
            headers: {
              Authorization: `Bearer ${configEnv.fb_lead.access_token}`
            }
          }

          const fbResponse = await axios.get(url, headers)
          const leadDetails = fbResponse.data

          const parsedFields = {}
          ;(leadDetails.field_data || []).forEach((field) => {
            parsedFields[field.name] = field.values[0]
          })

          const leadInfo = {
            leadgen_id: leadDetails?.id,
            form_id: leadDetails?.form_id,
            created_time: new Date(leadDetails?.created_time),
            page_id: change?.value.page_id,
            data: parsedFields
          }

          console.log('Lead Info:', leadInfo)

          const body = {
            name:
              leadInfo?.data?.full_name ||
              leadInfo?.data?.['full name'] ||
              null,
            phone: leadInfo.data?.phone_number || null,
            address: leadInfo.data?.address || null,
            details: leadInfo.data?.details || null,
            isAutomated: true,
            status: 'pending'
          }

          const count = await lead.find({}).sort({ leadId: -1 }).limit(1)
          body.leadId =
            _.size(count) && count[0].leadId ? count[0].leadId + 1 : 1
            const saveLead = new lead(body)
            return await saveLead.save()

        } catch (error) {
          console.error('❌ Error fetching lead details:', error)
          throw new Error('Error fetching lead details');
        }
      }
    }
  }
})


app.listen(port, () => {
    connect()
    console.log(`Server running on http://localhost:${port}`);
});
