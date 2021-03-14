const mongoose= require('mongoose')
const dotenv= require('dotenv')
const express=require('express')
const app=express();

app.use(express.json());

dotenv.config()

mongoose.connect(process.env.MONGO_URL)
    .then(()=> console.log('Connected to MongoDB!'))
    .catch(err=> console.error (`Could not connected to MongoDB.`, err))

const niceSchema = new mongoose.Schema({
    encouragement: String
})

const Encouragement=mongoose.model('encouragements', niceSchema);

let encouragements=[
    'Cheer up!',
    'Hang in there.',
    'You are a great person / bot!',
    'you are awesome!',
    'you are valid',
    'you are smart'
  ]

app.get('/', async (req, res)=>{
    let data= await Encouragement.find()
    res.send(data)
})

app.post('/', async (req, res)=>{
    const submittedNice= req.body
    try{
      let createdNice= await Encouragement.create(submittedNice)
      res.send(createdNice)
    } 
    catch (error) {
      res.send(error)
    }
  })

app.get('/:id', async (req, res, next) => {
    let niceId = req.params.id;
    try{
      let data = await Encouragement.findById(niceId);
       res.send(data);
    }
     catch(error){
       res.sendStatus(404)
     }
  });

app.delete('/:id', async(req,res)=>{
    try{
      const foundNice= await Encouragement.deleteOne({_id: req.params.id})
      res.send(foundNice)
    }
    catch(error){
      res.sendStatus(404)
    } 
  })

const port=process.env.PORT || 3000
app.listen(port, () =>{
    console.log(`Listening on port ${port}...`)
})